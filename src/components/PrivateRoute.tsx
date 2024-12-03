import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUser();

  if (!user) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }

  // Nếu người dùng đã đăng nhập, hiển thị nội dung của trang
  return children;
};

export default PrivateRoute;