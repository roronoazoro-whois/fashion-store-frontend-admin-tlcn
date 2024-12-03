import axios from "axios";

// Định nghĩa URL cơ sở của API
const BASE_URL = "http://localhost:8080/api/auth";

// Định nghĩa kiểu dữ liệu cho thông tin đăng nhập
interface LoginCredentials {
  email: string;
  password: string;
}

// Định nghĩa kiểu dữ liệu cho phản hồi khi đăng nhập
interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    email: string;
    role: string;
    expiration: number;
  };
}

// Hàm đăng nhập người dùng
export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials);

    // Kiểm tra nếu đăng nhập thành công
    if (response.data.success) {
      return response.data; // Trả về dữ liệu nếu thành công
    } else {
      throw new Error(response.data.message); // Ném ra lỗi nếu không thành công
    }
  } catch (error) {
    // Kiểu lỗi AxiosError để truy cập thông tin lỗi từ phản hồi
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại.";
      throw new Error(errorMessage);
    }

    // Nếu không phải lỗi axios, ném ra một lỗi chung
    throw new Error("Đã xảy ra lỗi không xác định.");
  }
};
