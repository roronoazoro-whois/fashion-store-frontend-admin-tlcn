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
      `${BASE_URL}/all?page=${page + 1}&size=${size + 1}`,
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
    active: boolean;
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

// Định nghĩa kiểu dữ liệu trả về khi lấy thông tin người dùng
interface UserInfoResponseExtended {
  message: string;
  success: boolean;
  data: {
    fullName: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
  };
}

// Hàm lấy thông tin người dùng
export const getUserInfo = async (
  token: string
): Promise<UserInfoResponseExtended["data"]> => {
  try {
    const response = await axios.get<UserInfoResponseExtended>(
      `${BASE_URL}/info`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
    return response.data.data; // Trả về thông tin người dùng
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

// Định nghĩa kiểu dữ liệu trả về khi cập nhật thông tin người dùng
interface UpdateUserInfoResponse {
  message: string;
  success: boolean;
  data: null;
}

// Cập nhật thông tin người dùng
export const updateUserInfo = async (
  token: string,
  userInfo: {
    fullName: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
  }
): Promise<UpdateUserInfoResponse> => {
  try {
    const response = await axios.put<UpdateUserInfoResponse>(
      `${BASE_URL}/update`,
      userInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

// Định nghĩa kiểu dữ liệu trả về khi cập nhật avatar
interface UpdateAvatarResponse {
  message: string;
  success: boolean;
  data: null;
}

// Cập nhật avatar
export const updateAvatar = async (
  token: string,
  avatarUrl: string
): Promise<UpdateAvatarResponse> => {
  try {
    const response = await axios.put<UpdateAvatarResponse>(
      `${BASE_URL}/update-avatar`,
      { avatar: avatarUrl }, // Gửi URL avatar trong body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Kèm theo token trong header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};

// Định nghĩa kiểu dữ liệu trả về khi đăng ký người dùng
interface RegisterUserResponse {
  message: string;
  success: boolean;
  data: null;
}

// Hàm đăng ký người dùng
export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<RegisterUserResponse> => {
  try {
    const response = await axios.post<RegisterUserResponse>(
      `${BASE_URL}/register`,
      userData
    );

    return response.data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

export const toggleUserAccount = async (
  username: string,
  token: string
): Promise<string> => {
  try {
    // Gọi PUT request để thay đổi trạng thái tài khoản người dùng
    const response = await axios.put<UpdateRoleResponse>(
      `${BASE_URL}/change-status/${username}`,
      {}, // Không cần body, chỉ cần URL với username và headers
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Kiểm tra kết quả trả về
    if (response.data.success) {
      return response.data.message; // Trả về thông báo thành công
    } else {
      throw new Error(response.data.message || "Lỗi không xác định"); // Nếu không thành công, ném lỗi
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Xử lý lỗi khi gọi API
    console.error("Error toggling user account:", error);
    throw new Error(error.response?.data?.message || "Lỗi không xác định"); // Trả về lỗi chi tiết từ server nếu có
  }
};
