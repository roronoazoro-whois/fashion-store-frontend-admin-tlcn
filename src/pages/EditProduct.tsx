import { useState } from "react";
import { HiOutlineSave } from "react-icons/hi";
import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import * as Yup from "yup"; // Import Yup
import { updateProduct, updateProductImages } from "../api/ProductAPI"; // API tạo sản phẩm
import { updateProductVariants } from "../api/ProductVariantAPI"; // API tạo variants
import { getUserFromLocalStorage } from "../utils/authUtils";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getProductDetailsById, getImagesByProductId } from "../api/ProductAPI"; // Import API lấy thông tin sản phẩm
import { useParams } from "react-router-dom"; // Import useParams từ react-router-dom

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

interface Image {
  id: number;
  url: string;
  altText: string | null;
  thumbnail: boolean;
}

const categories: Category[] = [
  { id: 1, name: "Áo thun", slug: "ao-thun" },
  { id: 2, name: "Quần áo", slug: "quan-ao" },
  { id: 3, name: "Phụ kiện", slug: "phu-kien" },
  { id: 4, name: "Áo nam", slug: "ao-nam" },
  { id: 5, name: "Áo polo", slug: "ao-polo" },
  { id: 6, name: "Áo sơ mi", slug: "ao-so-mi" },
  { id: 7, name: "Áo dài tay", slug: "ao-dai-tay" },
  { id: 8, name: "Áo khoác", slug: "ao-khoac" },
  { id: 9, name: "Áo Tanktop", slug: "ao-tank-top" },
  { id: 10, name: "Áo thể thao", slug: "ao-the-thao" },
  { id: 11, name: "Quần nam", slug: "quan-nam" },
  { id: 12, name: "Quần shorts", slug: "quan-shorts" },
  { id: 13, name: "Quần jeans", slug: "quan-jeans" },
  { id: 14, name: "Quần dài", slug: "quan-dai" },
  { id: 15, name: "Quần thể thao", slug: "quan-the-thao" },
  { id: 16, name: "Quần lót", slug: "quan-lot" },
  { id: 17, name: "Quần bơi", slug: "quan-boi" },
  { id: 18, name: "Tất/Vớ", slug: "tat-vo" },
  { id: 19, name: "Mũ/Nón", slug: "mu-non" },
  { id: 20, name: "Túi", slug: "tui" },
  {
    id: 21,
    name: "Quần lót Brief (Tam giác)",
    slug: "quan-lot-brief-tam-giac",
  },
  { id: 22, name: "Quần lót Trunk (Boxer)", slug: "quan-lot-trunk-boxer" },
  { id: 23, name: "Boxer Brief (Boxer dài)", slug: "boxer-brief-boxer-dai" },
  { id: 24, name: "Long Leg", slug: "long-leg" },
  { id: 25, name: "Boxer Shorts", slug: "boxer-shorts" },
  { id: 26, name: "Thể thao", slug: "the-thao" },
  { id: 27, name: "Quần Joggers", slug: "quan-joggers" },
  { id: 28, name: "Mặc hàng ngày", slug: "mac-hang-ngay" },
];

const colors: Color[] = [
  { id: 1, code: "#3498db", name: "Xanh" },
  { id: 2, code: "#000000", name: "Đen" },
  { id: 3, code: "#7f8c8d", name: "Xám" },
  { id: 4, code: "#ffffff", name: "Trắng" },
  { id: 5, code: "#e74c3c", name: "Đỏ" },
  { id: 6, code: "#2c3e50", name: "Xanh navy" },
  { id: 7, code: "#2e8b57", name: "Xanh rêu" },
  { id: 8, code: "#f5f5dc", name: "Kem" },
];

const sizes: Size[] = [
  { id: 1, name: "S" },
  { id: 2, name: "M" },
  { id: 3, name: "L" },
  { id: 4, name: "39-42" },
  { id: 5, name: "43-46" },
];

interface QuantityMap {
  [key: string]: number | string;
}

const EditProduct = () => {
  // State cho các lựa chọn
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  console.log("Product ID:", id); // Kiểm tra xem id có giá trị hay không
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
  const [loadingImages, setLoadingImages] = useState(false);
  let urlImages: string[] = [];
  const [productImages, setProductImages] = useState<Image[]>([]); // Lưu trữ hình ảnh
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "save" hoặc "upload"

  const ConfirmationModal = ({
    onConfirm,
    onCancel,
  }: {
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-semibold">Xác nhận hành động</h3>
          <p className="mt-4">Bạn có chắc chắn muốn cập nhật nội dung này?</p>
          <div className="mt-6 flex justify-end gap-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={onCancel}
            >
              Hủy
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                onConfirm(); // Thực hiện lưu khi người dùng xác nhận
              }}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveClick = () => {
    setActionType("save");
    setShowConfirmationModal(true); // Hiển thị modal
  };

  const handleSaveImagesClick = () => {
    setActionType("upload");
    setShowConfirmationModal(true); // Hiển thị modal
  };

  const handleConfirm = () => {
    setShowConfirmationModal(false); // Đóng modal khi xác nhận
    if (actionType === "save") {
      handleSave(); // Thực hiện lưu sản phẩm
    } else if (actionType === "upload") {
      handleSaveImages(); // Thực hiện cập nhật hình ảnh
    }
  };

  const handleCancel = () => {
    setShowConfirmationModal(false); // Đóng modal khi hủy
  };

  const fetchProductImages = async (productId: string) => {
    try {
      const images = await getImagesByProductId(Number(productId)); // Gọi API để lấy hình ảnh
      setProductImages(images); // Lưu kết quả vào state
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Không thể tải danh sách hình ảnh.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductImages(id); // Gọi API với ID sản phẩm
    }
  }, [id]); // Khi ID thay đổi thì gọi lại API

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await getProductDetailsById(Number(productId)); // Lấy id là number
      console.log("Response:", response); // In kết quả API
      if (response.success) {
        const productData = response.data!;
        console.log("Product details:", productData);

        setName(productData.name);
        setDescription(productData.description);
        setPrice(productData.price);
        setSalePrice(productData.salePrice);

        // Chuyển danh mục từ slug sang id
        setSelectedCategories(
          productData.categorySlugs.map(
            (slug) =>
              categories.find((category) => category.slug === slug)?.id || -1
          )
        );

        // Chuyển màu sắc từ tên màu sang id
        setSelectedColors(
          productData.colorNames.map(
            (colorName) =>
              colors.find((color) => color.name === colorName)?.id || -1
          )
        );

        // Chuyển kích thước từ tên kích thước sang id
        setSelectedSizes(
          productData.sizeNames.map(
            (sizeName) => sizes.find((size) => size.name === sizeName)?.id || -1
          )
        );

        setQuantityMap;
        const newQuantityMap: QuantityMap = {};
        productData.variants.forEach((variant) => {
          const colorName = variant.colorName || "Không có màu";
          const sizeName = variant.sizeName || "Không có kích thước";
          newQuantityMap[`${colorName}.${sizeName}`] = variant.quantity;
        });
        setQuantityMap(newQuantityMap);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Không thể tải thông tin sản phẩm.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails(id); // Gọi API với id từ URL
    }
  }, [id]); // Chạy lại khi id thay đổi

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
      console.log("Product Update DTO:", productCreateDto);

      //  Bước 1: Cập nhật sản phẩm
      const productId = await updateProduct(
        productCreateDto,
        token,
        Number(id)
      ); // Gọi API tạo sản phẩm
      if (!productId) {
        toast.error("Không thể cập nhật sản phẩm.");
        return;
      }

      // Bước 2: Cập nhật variants cho sản phẩm
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

      // Log dữ liệu gửi cho API cập nhật variants
      console.log("Product Variants Request:", createProductVariantsRequest);
      try {
        await updateProductVariants(productId, productVariants, token);
        toast.success("Sản phẩm đã được cập nhật thành công!");
        setLoading(false); // Hoàn thành khi không có lỗi
        if (id) {
          fetchProductDetails(id); // Gọi lại API để cập nhật thông tin sản phẩm
        }
      } catch (error) {
        toast.error("Không thể cập nhật số lượng cho sản phẩm.");
        return;
      }
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

  const handleSaveImages = async () => {
    // Kiểm tra nếu không có hình ảnh nào được chọn
    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh để cập nhật.");
      return;
    }

    // Bật loading khi bắt đầu upload
    setLoadingImages(true);

    try {
      // Bước 3: Upload ảnh lên Cloudinary
      const cloudinaryUploadURL =
        "https://api.cloudinary.com/v1_1/doo4qviqi/image/upload";
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
        setLoadingImages(false); // Tắt loading khi có lỗi
        return;
      }

      // Bước 4: Lưu URL ảnh vào cơ sở dữ liệu
      const createProductImagesDto = {
        imageUrls: urlImages,
      };
      console.log("Product Images Request:", createProductImagesDto);
      try {
        const token = getUserFromLocalStorage()?.token;
        if (!token) {
          throw new Error("Token is undefined");
        }
        await updateProductImages(Number(id), urlImages, token); // Gọi API tạo ảnh cho sản phẩm
        toast.success("Cập nhật hình ảnh thành công!");
        if (id) {
          fetchProductImages(id); // Gọi lại API để cập nhật hình ảnh
        }
      } catch (error) {
        toast.error("Không thể lưu ảnh vào cơ sở dữ liệu.");
        setLoadingImages(false); // Tắt loading khi có lỗi
        return;
      }

      setLoadingImages(false); // Tắt loading khi hoàn tất
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Không thể cập nhật hình ảnh.");
      setLoadingImages(false); // Tắt loading khi có lỗi
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
              onClick={handleSaveClick} // Gọi handleSaveClick khi bấm nút Lưu lại
              className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
              disabled={loading}
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
                      checked={selectedCategories.includes(category.id)} // Đảm bảo checkbox được check đúng
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
                      checked={selectedColors.includes(color.id)} // Đảm bảo checkbox được check đúng
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
                      checked={selectedSizes.includes(size.id)} // Đảm bảo checkbox được check đúng
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
                        value={
                          quantityMap[combinationKey]
                            ? quantityMap[combinationKey]
                            : ""
                        }
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
              {/* Hiển thị danh sách hình ảnh hiện tại */}
              <h3 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Hình ảnh sản phẩm hiện tại
              </h3>
              <div className="mt-8">
                {productImages.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Chưa có hình ảnh nào được tải lên.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-8">
                    {productImages.map((image) => (
                      <div key={image.id} className="relative group">
                        {/* Tăng kích thước ảnh với aspect ratio */}
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={image.url}
                            alt={image.altText || "Image"}
                            className="w-full h-full object-cover rounded-lg shadow-2xl transition-transform duration-300 transform group-hover:scale-110"
                          />
                        </div>
                        {/* Hiển thị mô tả altText nếu có */}
                        {image.altText && (
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4 text-lg font-semibold rounded-b-lg">
                            {image.altText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images}</p>
              )}
              <br />
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tải lên bộ hình ảnh mới
              </h3>
              {/* Image upload component */}
              <ImageUpload onImagesSelected={handleImagesSelected} />

              <button
                onClick={handleSaveImagesClick} // Gọi handleSaveImagesClick khi bấm nút Cập nhật hình ảnh
                className="mt-6 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={loadingImages}
              >
                {loadingImages ? (
                  <div className="flex justify-center items-center">
                    <div className="spinner-border animate-spin w-6 h-6 border-t-2 border-white rounded-full mr-2"></div>
                    <span className="ml-2">Đang tải lên...</span>
                  </div>
                ) : (
                  "Cập nhật hình ảnh"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Hiển thị modal nếu showConfirmationModal là true */}
      {showConfirmationModal && (
        <ConfirmationModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default EditProduct;
