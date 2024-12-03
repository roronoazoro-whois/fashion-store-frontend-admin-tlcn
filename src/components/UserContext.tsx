import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserFromLocalStorage } from "../utils/authUtils";

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  token: string;
  email: string;
  role: string;
  expiration: number;
}

// Định nghĩa kiểu cho context
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Tạo context với giá trị mặc định
const UserContext = createContext<UserContextType | undefined>(undefined);

// Định nghĩa props cho UserProvider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (userData) {
      setUser(userData);
    } else {
      logout(); // Token đã hết hạn, đăng xuất
    }
  }, []); // Chạy một lần khi component mount

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("expiration", userData.expiration.toString()); // Lưu trữ thời gian hết hạn
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("expiration");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
