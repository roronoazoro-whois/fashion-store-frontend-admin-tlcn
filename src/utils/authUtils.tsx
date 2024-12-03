// Định nghĩa kiểu cho thông tin người dùng
interface User {
  token: string;
  email: string;
  role: string;
  expiration: number;
}

// Hàm lấy thông tin người dùng từ LocalStorage
export const getUserFromLocalStorage = (): User | null => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const expiration = localStorage.getItem("expiration");

  // Kiểm tra xem các giá trị có tồn tại không
  if (token && email && role && expiration) {
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)

    // Kiểm tra xem token có hết hạn không
    if (Number(expiration) > currentTime) {
      return { token, email, role, expiration: Number(expiration) };
    }
  }

  return null; // Không có thông tin người dùng hợp lệ
};
