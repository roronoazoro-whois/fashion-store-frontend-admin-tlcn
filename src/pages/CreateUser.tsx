import { HiOutlineSave } from "react-icons/hi";
import {
  InputWithLabel,
  Sidebar,
  SimpleInput,
  WhiteButton,
} from "../components";
import SelectInput from "../components/SelectInput";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser, updateUserRole } from "../api/UserAPI"; // Import API đăng ký người dùng
import { toast } from "react-toastify"; // Thêm thư viện thông báo
import { getUserFromLocalStorage } from "../utils/authUtils";

// Xác thực dữ liệu đầu vào bằng yup
const schema = yup
  .object({
    fullName: yup.string().required("Họ và tên là bắt buộc"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
    role: yup.string().required("Vai trò là bắt buộc"),
  })
  .required();

const CreateUser = () => {
  const roles = [
    { value: "USER", label: "USER" },
    { value: "STAFF", label: "STAFF" },
    { value: "ADMIN", label: "ADMIN" },
  ]; // Các giá trị vai trò được gán cứng ở đây

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "USER", // Gán vai trò mặc định là 'USER'
    },
  });

  const onSubmit = async (data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    try {
      // Gọi API đăng ký người dùng mới
      const response = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (!response.success) {
        // Nếu đăng ký người dùng thất bại
        toast.error(response.message || "Đã có lỗi xảy ra khi tạo người dùng.");
        return; // Dừng lại tại đây
      }
      // Nếu đăng ký thành công, tiếp tục gọi API cập nhật vai trò
      const token = getUserFromLocalStorage()?.token;
      if (!token) {
        throw new Error("Token is undefined");
      }
      const roleResponse = await updateUserRole(data.email, data.role, token);

      if (roleResponse) {
        toast.success("Tạo người dùng mới thành công.");
      } else {
        throw new Error("Đã có lỗi khi cập nhật vai trò người dùng.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Kiểm tra lỗi từ API và hiển thị thông báo lỗi từ response
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Đã có lỗi xảy ra.";
        toast.error(errorMessage);
      } else {
        toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm người dùng mới
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton
                onClick={handleSubmit(onSubmit)} // Gọi hàm onSubmit khi bấm nút
                textSize="lg"
                width="48"
                py="2"
                text="Lưu lại"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
            </div>
          </div>

          {/* Thêm thông tin người dùng */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Thông tin người dùng */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin người dùng
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                {/* Họ và Tên */}
                <InputWithLabel label="Họ và Tên">
                  <Controller
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                      <SimpleInput
                        type="text"
                        placeholder="Nhập họ và tên..."
                        {...field}
                      />
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </InputWithLabel>

                {/* Email */}
                <InputWithLabel label="Email">
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <SimpleInput
                        type="email"
                        placeholder="Nhập email ..."
                        {...field}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </InputWithLabel>

                {/* Mật khẩu */}
                <InputWithLabel label="Mật khẩu">
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <SimpleInput
                        type="password"
                        placeholder="Nhập mật khẩu..."
                        {...field}
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </InputWithLabel>

                {/* Xác nhận mật khẩu */}
                <InputWithLabel label="Xác nhận mật khẩu">
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <SimpleInput
                        type="password"
                        placeholder="Nhập xác nhận mật khẩu..."
                        {...field}
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </InputWithLabel>

                {/* Vai trò */}
                <InputWithLabel label="Chọn vai trò">
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <SelectInput selectList={roles} {...field} />
                    )}
                  />
                  {errors.role && (
                    <p className="text-red-500 text-sm">
                      {errors.role.message}
                    </p>
                  )}
                </InputWithLabel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
