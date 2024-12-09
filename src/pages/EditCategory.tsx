import { HiOutlineSave } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { InputWithLabel, Sidebar, SimpleInput } from "../components";
import CategoryAPI from "../api/CategoryAPI"; // Đảm bảo bạn đã import API đúng
import { getUserFromLocalStorage } from "../utils/authUtils";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom"; // Import useParams để lấy id từ URL

// Validation schema với Yup
const schema = Yup.object({
  name: Yup.string().required("Tên danh mục không được để trống").min(3, "Tên danh mục phải có ít nhất 3 ký tự"), // Thêm điều kiện tên
  slug: Yup.string().min(3, "Slug phải có ít nhất 3 ký tự")
    .required("Slug không được để trống")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug phải chỉ chứa chữ cái, số và dấu gạch nối"
    ), // Thêm điều kiện slug
}).required();

const EditCategory = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Trạng thái của modal
  const [categoryData, setCategoryData] = useState({ name: "", slug: "" });

  // Hook form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", slug: "" },
  });

  useEffect(() => {
    // Lấy dữ liệu category từ API khi id có sẵn
    const fetchCategoryData = async () => {
      try {
        const category = await CategoryAPI.getCategoryById(Number(id)); // Lấy category theo id từ URL
        setCategoryData({ name: category.name, slug: category.slug });
        setValue("name", category.name); // Điền dữ liệu vào form
        setValue("slug", category.slug);
      } catch (error) {
        setErrorMessage("Không thể lấy dữ liệu danh mục. Vui lòng thử lại.");
      }
    };

    if (id) {
      fetchCategoryData();
    }
  }, [id, setValue]);

  const handleNameChange = (value: string) => {
    setCategoryData((prev) => {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-/, "")
        .replace(/-$/, "");
      setValue("slug", generatedSlug); // Cập nhật slug tự động
      return { ...prev, name: value, slug: generatedSlug };
    });
  };

  // Xử lý submit form khi modal xác nhận
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const onSubmit = async (data: any) => {
    const token = getUserFromLocalStorage()?.token;
    if (!token) {
      setErrorMessage("User token is missing. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(""); // Reset lỗi trước khi gửi yêu cầu
      console.log("Data to be updated: ", data);
      await CategoryAPI.updateCategory(Number(id), data, token); // Gửi dữ liệu cập nhật lên server
      setShowModal(false); // Ẩn modal sau khi tạo thành công
      toast.success("Cập nhật danh mục thành công");
    } catch (error) {
      setErrorMessage("Cập nhật danh mục thất bại. Vui lòng thử lại.");
      toast.error("Cập nhật danh mục thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = () => {
    // Validate form trước khi hiển thị modal
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSubmit((data) => {
      // Nếu form hợp lệ, mở modal
      setShowModal(true);
    })();
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Chỉnh sửa danh mục
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button
                onClick={handleSaveClick} // Gọi hàm handleSaveClick khi nhấn "Lưu lại"
                className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
                disabled={isLoading}
              >
                <HiOutlineSave className="dark:hover:text-blackPrimary hover:text-whiteSecondary dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  {isLoading ? "Đang lưu..." : "Lưu lại"}
                </span>
              </button>
            </div>
          </div>

          {/* Add Category section here */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin category
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên category">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <SimpleInput
                        type="text"
                        value={categoryData.name}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNameChange(e.target.value);
                        }}
                        placeholder="Enter a category title..."
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </InputWithLabel>

                <InputWithLabel label="Slug">
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <SimpleInput
                        type="text"
                        {...field}
                        placeholder="Enter a category slug..."
                      />
                    )}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-xs">
                      {errors.slug.message}
                    </p>
                  )}
                </InputWithLabel>
              </div>
            </div>
          </div>

          {/* Hiển thị thông báo lỗi nếu có */}
          {errorMessage && (
            <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
          )}
        </div>
      </div>

      {/* Modal xác nhận */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Xác nhận</h3>
            <p className="mb-4">Bạn có chắc chắn muốn cập nhật danh mục này?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCategory;
