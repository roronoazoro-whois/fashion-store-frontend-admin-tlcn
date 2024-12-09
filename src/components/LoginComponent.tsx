import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thay 'next/router' bằng 'react-router-dom'
import { FaTshirt } from "react-icons/fa";
import { InputWithLabel, SimpleInput, WhiteButton } from "../components";
import { useUser } from "../components/UserContext";
import { loginUser } from "../api/AuthAPI";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface LoginFormData {
  email: string;
  password: string;
}

// Định nghĩa schema với Yup cho đăng nhập
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const LoginComponent = () => {
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate(); // Thay 'useRouter' bằng 'useNavigate' từ 'react-router-dom'
  const { login, user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      if (showToast) {
        setTimeout(() => {
          navigate("/"); // Thay 'router.push("/")' bằng 'navigate("/")'
        }, 1000);
      } else {
        navigate("/"); // Thay 'router.push("/")' bằng 'navigate("/")'
      }
    } else {
      setLoading(false); // Nếu chưa đăng nhập, dừng loading
    }
  }, [user, navigate, showToast]); // Thêm 'navigate' vào dependencies

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      console.log("Form submitted with data:", data);
      const response = await loginUser(data);
      const userData = response.data;
      if (userData?.role !== "ADMIN" && userData?.role !== "STAFF") {
        setLoginErrorMessage("Bạn không có quyền truy cập trang này.");
        return;
      }
      if (userData) {
        login(userData); // Đăng nhập và lưu thông tin vào context
        setSuccessMessage("Đăng nhập thành công!");
        setShowToast(true);
        setTimeout(() => {
          navigate("/"); // Thay 'router.push("/")' bằng 'navigate("/")'
        }, 1000);
      }
    } catch (error: unknown) {
      setLoginErrorMessage(
        (error as Error).message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
      setSuccessMessage("");
    }
  };

  // Hiển thị spinner trong khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-r from-blue-500 via-teal-400 to-purple-600 flex justify-center items-center py-10">
        <div className="bg-white p-8 rounded-lg shadow-xl w-[500px] max-sm:w-[400px] max-[420px]:w-[320px] text-center">
          <p>Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (user && !showToast) {
    // Nếu user đã đăng nhập, không render nội dung login
    return null; // Không render gì cả, sẽ chuyển hướng ở trên
  } else {
    // Nếu user chưa đăng nhập, render nội dung đăng nhập
    return (
      <div className="w-full min-h-screen bg-gradient-to-r from-blue-500 via-teal-400 to-purple-600 flex justify-center items-center py-10">
        <div className="bg-white rounded-lg shadow-xl w-[500px] p-8 flex flex-col gap-8 max-sm:w-[400px] max-[420px]:w-[320px]">
          <div className="flex flex-col items-center gap-6">
            <FaTshirt className="text-6xl text-blue-500 hover:rotate-180 transition-transform duration-500 cursor-pointer" />
            <h1 className="text-3xl text-gray-800 font-semibold">
              ADMIN DASHBOARD
            </h1>
            <h1>COOLMAN STORE</h1>
          </div>

          {/* Thông báo lỗi hoặc thành công */}
          {loginErrorMessage && (
            <p className="text-sm text-red-600">{loginErrorMessage}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="w-full flex flex-col gap-6"
          >
            <InputWithLabel label="Email">
              <SimpleInput
                type="email"
                placeholder="Enter your email..."
                {...register("email")}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </InputWithLabel>

            <InputWithLabel label="Password">
              <SimpleInput
                type="password"
                placeholder="Enter your password..."
                {...register("password")}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </InputWithLabel>

            <WhiteButton
              type="submit" // Đảm bảo nút này là submit form
              text="Đăng nhập"
              textSize="lg"
              width="full"
              py="3"
            />
          </form>

          <p className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer transition-colors mt-3">
            Quên mật khẩu
          </p>

          {/* Thông báo Toast */}
          {showToast && (
            <div className="fixed top-5 right-5 z-50">
              <div className="bg-green-500 text-white px-4 py-2 rounded-md">
                {successMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default LoginComponent;
