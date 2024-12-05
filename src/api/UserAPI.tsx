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

// Định nghĩa kiểu dữ liệu trả về từ API khi cập nhật quyền người dùng
interface UpdateRoleResponse {
  message: string;
  success: boolean;
  data: null;
}

const BASE_URL = "http://localhost:8080/user";

// Hàm cập nhật quyền cho người dùng
export const updateUserRole = async (
  username: string, // Tên người dùng (hoặc email)
  roleName: string, // Tên quyền mới
  token: string // Token xác thực
): Promise<string> => {
  try {
    const response = await axios.put<UpdateRoleResponse>(
      `${BASE_URL}/update-role/${username}`,
      { role: roleName }, // Thông tin gửi đi trong body yêu cầu
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Đảm bảo gửi dữ liệu đúng định dạng JSON
        },
      }
    );

    if (response.data.success) {
      return response.data.message; // Trả về thông báo thành công
    } else {
      throw new Error(response.data.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error(
      error instanceof Error ? error.message : "Lỗi không xác định"
    );
  }
};

// Lấy avatar và tên đầy đủ của người dùng
export const getUserAvatarAndFullName = async (
  token: string
): Promise<UserResponse["data"]> => {
  try {
    const response = await axios.get<UserResponse>(
      `${BASE_URL}/avatar-and-fullname`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
    return response.data.data; // Trả về thông tin người dùng
  } catch (error) {
    console.error("Error getting user avatar and full name:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

// Định nghĩa kiểu người dùng
interface User {
  fullName: string;
  avatar: string;
  email: string | null;
  phoneNumber: string | null;
  roleName: string;
}

// Định nghĩa kiểu dữ liệu trả về từ API khi lấy danh sách người dùng
export interface UsersListResponse {
  message: string;
  success: boolean;
  data: {
    content: User[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

// Hàm lấy danh sách người dùng
export const getUsersList = async (
  page: number = 1,
  size: number = 15,
  token: string
): Promise<UsersListResponse> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get<UsersListResponse>(
      `${BASE_URL}/all?page=${page + 1}&size=${size}`,
      { headers }
    );

    if (response.data.success) {
      return response.data; // Trả về dữ liệu với thông tin phân trang
    } else {
      throw new Error(response.data.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Error getting users list:", error);
    throw new Error("Lỗi không xác định");
  }
};

// Định nghĩa kiểu dữ liệu trả về khi lấy thông tin người dùng
interface UserInfoResponse {
  message: string;
  success: boolean;
  data: {
    fullName: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    roleName: string;
  };
}

// Hàm lấy thông tin người dùng qua username (email)
export const getUserInfoByUsername = async (
  username: string, // Tên người dùng (hoặc email)
  token: string // Token xác thực
): Promise<UserInfoResponse["data"]> => {
  try {
    const response = await axios.get<UserInfoResponse>(
      `${BASE_URL}/info/${username}`, // Endpoint để lấy thông tin người dùng theo username
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );

    if (response.data.success) {
      return response.data.data; // Trả về thông tin người dùng
    } else {
      throw new Error(response.data.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Error getting user info by username:", error);
    throw new Error("Lỗi không xác định");
  }
};
