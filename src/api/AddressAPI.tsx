import axios from "axios";

// Định nghĩa kiểu dữ liệu cho từng địa chỉ
interface UserAddress {
  id: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  defaultAddress: boolean;
}

// Định nghĩa kiểu dữ liệu trả về từ API
interface UserAddressesResponse {
  message: string;
  success: boolean;
  data: UserAddress[];
}

const BASE_URL = "http://localhost:8080/address/user"; // Địa chỉ API của bạn

// Lấy danh sách địa chỉ của người dùng
export const getUserAddresses = async (
  token: string
): Promise<UserAddress[]> => {
  try {
    const response = await axios.get<UserAddressesResponse>(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });

    if (response.data.success) {
      return response.data.data; // Trả về danh sách địa chỉ
    } else {
      throw new Error(response.data.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};
