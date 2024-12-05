import { useState } from "react";
import { HiOutlineSave } from "react-icons/hi";
import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import * as Yup from "yup"; // Import Yup

import { createProduct } from "../api/ProductAPI"; // API tạo sản phẩm
import { createProductImages } from "../api/ProductAPI"; // API tạo ảnh cho sản phẩm
import { createProductVariants } from "../api/ProductVariantAPI"; // API tạo variants
import { getUserFromLocalStorage } from "../utils/authUtils";
import axios from "axios";
import { toast } from "react-toastify";

// Các danh mục, màu sắc và kích thước
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Color {
  id: number;
  code: string;
  name: string;
}

interface Size {
  id: number;
  name: string;
}

const categories: Category[] = [
  { id: 1, name: "Áo thun", slug: "ao-thun" },
  { id: 2, name: "Quần áo", slug: "quan-ao" },
  { id: 3, name: "Phụ kiện", slug: "phu-kien" },
];

const colors: Color[] = [
  { id: 1, code: "#3498db", name: "Xanh" },
  { id: 2, code: "#000000", name: "Đen" },
  { id: 3, code: "#7f8c8d", name: "Xám" },
  { id: 4, code: "#ffffff", name: "Trắng" },
  { id: 5, code: "#e74c3c", name: "Đỏ" },
];

const sizes: Size[] = [
  { id: 1, name: "S" },
  { id: 2, name: "M" },
  { id: 3, name: "L" },
];

interface QuantityMap {
  [key: string]: number | string;
}

const CreateProduct = () => {
  // State cho các lựa chọn
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>(0);
  const [salePrice, setSalePrice] = useState<number | string>(0);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [quantityMap, setQuantityMap] = useState<QuantityMap>({});
  const [images, setImages] = useState<File[]>([]); // Lưu trữ các file ảnh thực tế
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  let urlImages: string[] = [];

  const handleImagesSelected = (files: File[]) => {
    setImages(files); // Lưu trữ file thực tế thay vì URL
  };

  // Hàm xử lý thay đổi khi chọn màu sắc
  const handleColorChange = (colorId: number) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(colorId)
        ? prevColors.filter((id) => id !== colorId)
        : [...prevColors, colorId]
    );
  };

  // Hàm xử lý thay đổi khi chọn kích thước
  const handleSizeChange = (sizeId: number) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(sizeId)
        ? prevSizes.filter((id) => id !== sizeId)
        : [...prevSizes, sizeId]
    );
  };

  const generateCombinations = () => {
    const combinations: {
      colorId: number | null;
      sizeId: number | null;
      colorName: string;
      sizeName: string;
    }[] = [];

    // Nếu không có size hoặc color, thêm giá trị mặc định khác
    const selectedColorsList =
      selectedColors.length > 0 ? selectedColors : [null];
    const selectedSizesList = selectedSizes.length > 0 ? selectedSizes : [null];

    selectedColorsList.forEach((colorId) => {
      selectedSizesList.forEach((sizeId) => {
        combinations.push({
          colorId,
          sizeId,
          colorName: colorId
            ? colors.find((color) => color.id === colorId)!.name
            : "Không có màu",
          sizeName: sizeId
            ? sizes.find((size) => size.id === sizeId)!.name
            : "Không có kích thước",
        });
      });
    });

    return combinations;
  };

  const handleQuantityChange = (combinationKey: string, quantity: string) => {
    // Chuyển giá trị nhập thành number
    const quantityNumber = Number(quantity);
    setQuantityMap((prev) => ({
      ...prev,
      [combinationKey]: quantityNumber >= 0 ? quantityNumber : 0, // Đảm bảo số lượng không âm
    }));
  };

  const combinations = generateCombinations();

  const productSchema = Yup.object().shape({
    name: Yup.string().required("Tên sản phẩm không được để trống"),
    description: Yup.string().required("Mô tả sản phẩm không được để trống"),
    price: Yup.number()
      .positive("Giá gốc phải lớn hơn 0")
      .required("Giá gốc không được để trống"),
    salePrice: Yup.number()
      .notRequired()
      .min(0, "Giá khuyến mãi phải lớn hơn 0"),
    categories: Yup.array().min(1, "Bạn phải chọn ít nhất một danh mục"),
    images: Yup.array()
      .min(1, "Hình ảnh phải tối thiểu 1 ảnh")
      .max(6, "Tối đa 6 ảnh"),
    quantityMap: Yup.object().shape(
      Object.fromEntries(
        combinations.map((combination) => [
          `${combination.colorName}.${combination.sizeName}`, // Đảm bảo dùng dấu chấm
          Yup.number()
            .positive("Số lượng phải lớn hơn 0")
            .required("Số lượng không được để trống")
            .integer("Số lượng phải là một số nguyên")
            .min(1, "Số lượng phải lớn hơn 0"),
        ])
      )
    ),
  });

  const handleSave = async () => {
    try {
      setLoading(true); // Bắt đầu loading

      // Validate sản phẩm với schema Yup
      await productSchema.validate(
        {
          name,
          description,
          price,
          salePrice,
          categories: selectedCategories,
          images,
          quantityMap,
        },
        { abortEarly: false }
      );

      // Reset errors nếu validation thành công
      setErrors({});

      // Tạo sản phẩm mới (productCreateDto)
      const productCreateDto = {
        name: name,
        description: description,
        price: parseFloat(price as string),
        salePrice: parseFloat(salePrice as string),
        categorySlugs: selectedCategories.map(
          (id) => categories.find((category) => category.id === id)!.slug
        ),
        colorNames: selectedColors.map(
          (id) => colors.find((color) => color.id === id)!.name
        ),
        sizeNames: selectedSizes.map(
          (id) => sizes.find((size) => size.id === id)!.name
        ),
      };

      // Token sẽ được lấy từ localStorage sau khi đăng nhập
      const token = getUserFromLocalStorage()?.token || "";

      // Log dữ liệu gửi cho API tạo sản phẩm
      console.log("Product Create DTO:", productCreateDto);

      //  Bước 1: Tạo sản phẩm
      const productId = await createProduct(productCreateDto, token); // Gọi API tạo sản phẩm
      if (!productId) {
        toast.error("Không thể tạo sản phẩm.");
        return;
      }

      // Bước 2: Tạo variants cho sản phẩm
      const productVariants = generateCombinations().map((combination) => ({
        colorName:
          combination.colorName !== "Không có màu" ? combination.colorName : "",
        sizeName:
          combination.sizeName !== "Không có kích thước"
            ? combination.sizeName
            : "",
        quantity: Number(
          quantityMap[`${combination.colorName}.${combination.sizeName}`] || 0
        ),
      }));

      const createProductVariantsRequest = {
        variants: productVariants,
      };

      // Log dữ liệu gửi cho API tạo variants
      console.log("Product Variants Request:", createProductVariantsRequest);
      try {
        // Bước 3: Tạo variants cho sản phẩm
        await createProductVariants(productId, productVariants, token);
      } catch (error) {
        toast.error("Không thể tạo variants cho sản phẩm.");
        return;
      }

      // Bước 3: Upload ảnh lên Cloudinary
      const cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/doo4qviqi/image/upload`;
      const cloudinaryPreset = "ml_default"; // Tùy chọn preset của bạn

      const uploadPromises = images.map((imageFile) => {
        const data = new FormData();
        data.append("file", imageFile); // Gửi file thực tế
        data.append("upload_preset", cloudinaryPreset);

        return axios.post(cloudinaryUploadURL, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });

      try {
        // Chờ tất cả ảnh được upload xong và lấy URL từ Cloudinary
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map((result) => result.data.secure_url);

        // Cập nhật lại state images với các URL ảnh từ Cloudinary
        urlImages = imageUrls;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Cloudinary upload error:", error.response?.data);
        } else {
          console.error("Unexpected error:", error);
        }

        toast.error("Không thể tải ảnh lên Cloudinary.");
        return;
      }

      // Bước 4: Lưu URL ảnh vào cơ sở dữ liệu
      const createProductImagesDto = {
        imageUrls: urlImages,
      };

      console.log("Product Images Request:", createProductImagesDto);

      try {
        await createProductImages(productId, urlImages, token); // Gọi API tạo ảnh cho sản phẩm
        toast.success("Sản phẩm đã được tạo thành công!");
      } catch (error) {
        toast.error("Không thể lưu ảnh vào cơ sở dữ liệu.");
        return;
      }
      setLoading(false); // Hoàn thành khi không có lỗi
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors); // Cập nhật lỗi vào state
      } else {
        console.error("Unexpected error:", error);
      }
      setLoading(false); // Hoàn thành khi có lỗi
      toast.error("Vui lòng kiểm tra lại thông tin sản phẩm.");
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
              Thêm sản phẩm mới
            </h2>
            <button
              onClick={handleSave}
              className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
              disabled={loading} // Disable button khi đang loading
            >
              {loading ? (
                <>
                  <div className="spinner-border animate-spin w-6 h-6 border-t-2 border-white rounded-full mr-2"></div>
                  <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                    Đang lưu...
                  </span>
                </>
              ) : (
                <>
                  <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                  <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                    Lưu lại
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Left Div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin cơ bản
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên sản phẩm">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p> // Hiển thị lỗi nếu có
                  )}
                </InputWithLabel>

                <InputWithLabel label="Mô tả sản phẩm">
                  <TextAreaInput
                    placeholder="Nhập mô tả sản phẩm..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </InputWithLabel>

                <InputWithLabel label="Giá gốc">
                  <SimpleInput
                    type="number"
                    placeholder="Nhập giá gốc..."
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price}</p>
                  )}
                </InputWithLabel>

                <InputWithLabel label="Giá khuyến mãi">
                  <SimpleInput
                    type="number"
                    placeholder="Nhập giá khuyến mãi..."
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                  {errors.salePrice && (
                    <p className="text-red-500 text-sm">{errors.salePrice}</p>
                  )}
                </InputWithLabel>
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Sản phẩm thuộc danh mục:
              </h3>
              <div className="grid grid-cols-1 gap-y-3">
                {errors.categories && (
                  <p className="text-red-500 text-sm">{errors.categories}</p>
                )}
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="categories"
                      value={category.id}
                      className="form-checkbox"
                      onChange={() => {
                        setSelectedCategories((prev) =>
                          prev.includes(category.id)
                            ? prev.filter((id) => id !== category.id)
                            : [...prev, category.id]
                        );
                      }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Sản phẩm có màu:
              </h3>
              <div className="grid grid-cols-1 gap-y-3">
                {errors.colors && (
                  <p className="text-red-500 text-sm">{errors.colors}</p>
                )}
                {colors.map((color) => (
                  <label key={color.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="colors"
                      value={color.id}
                      className="form-checkbox"
                      onChange={() => handleColorChange(color.id)}
                    />
                    <span>{color.name}</span>
                  </label>
                ))}
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Sản phẩm có kích thước:
              </h3>
              <div className="grid grid-cols-1 gap-y-3">
                {errors.sizes && (
                  <p className="text-red-500 text-sm">{errors.sizes}</p>
                )}
                {sizes.map((size) => (
                  <label key={size.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size.id}
                      className="form-checkbox"
                      onChange={() => handleSizeChange(size.id)}
                    />
                    {size.name}
                  </label>
                ))}
              </div>

              {/* Nhập số lượng cho mỗi tổ hợp */}
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Số lượng sản phẩm (Màu sắc - Kích thước - Số lượng)
              </h3>
              <div className="mt-4">
                {combinations.map((combination, index) => {
                  const combinationKey = `${combination.colorName}.${combination.sizeName}`; // Sử dụng dấu chấm
                  return (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <span>
                        {combination.colorName} - {combination.sizeName}
                      </span>
                      <input
                        type="number"
                        placeholder="Nhập số lượng"
                        className="input"
                        value={quantityMap[combinationKey] || ""}
                        onChange={(e) =>
                          handleQuantityChange(combinationKey, e.target.value)
                        }
                      />
                      {errors[
                        `quantityMap["${combination.colorName}.${combination.sizeName}"]`
                      ] && (
                        <p className="text-red-500 text-sm">
                          {
                            errors[
                              `quantityMap["${combination.colorName}.${combination.sizeName}"]`
                            ]
                          }
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Div - Hình ảnh sản phẩm */}
            <div>
              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images}</p>
              )}
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Hình ảnh sản phẩm
              </h3>
              {/* Image upload component */}
              <ImageUpload onImagesSelected={handleImagesSelected} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
