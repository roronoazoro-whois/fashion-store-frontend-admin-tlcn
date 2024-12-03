import axios from "axios";

// Định nghĩa kiểu dữ liệu trả về từ API
interface UserResponse {
  message: string;
  success: boolean;
  data: {
    fullName: string;
    avatar: string;
  };
}

const BASE_URL = "http://localhost:8080/user";

// Lấy avatar và tên đầy đủ của người dùng
export const getUserAvatarAndFullName = async (token: string): Promise<UserResponse['data']> => {
  try {
    const response = await axios.get<UserResponse>(`${BASE_URL}/avatar-and-fullname`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data.data; // Trả về thông tin người dùng
  } catch (error) {
    console.error("Error getting user avatar and full name:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};
