import { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { HiOutlineMenu } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import { toggleDarkMode } from "../features/darkMode/darkModeSlice";
import { getUserAvatarAndFullName } from "../api/UserAPI";

// Định nghĩa kiểu dữ liệu của API trả về
interface User {
  fullName: string;
  avatar: string;
  role: string;
}

const Header = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.darkMode);

  const [user, setUser] = useState<User>({
    fullName: "Loading...",
    avatar: "/src/assets/profile.jpg",
    role: "Loading...", // Mặc định role là "Loading..."
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (token) {
      getUserAvatarAndFullName(token)
        .then((data) => {
          setUser({
            fullName: data.fullName,
            avatar: data.avatar || "/src/assets/profile.jpg", // Sử dụng avatar mặc định nếu không có
            role: localStorage.getItem("role") || "User", // Lấy role từ localStorage, mặc định là "User"
          });
        })
        .catch((error) => {
          console.error("Không thể lấy thông tin người dùng:", error);
        });
    }
  }, []); // Chỉ gọi khi component được render lần đầu

  return (
    <header className="dark:bg-blackPrimary bg-whiteSecondary relative">
      <div className="flex justify-between items-center px-9 py-5 max-xl:flex-col max-xl:gap-y-7 max-[400px]:px-4">
        <HiOutlineMenu
          className="text-2xl dark:text-whiteSecondary text-blackPrimary absolute bottom-7 left-5 xl:hidden max-sm:static max-sm:order-1 cursor-pointer"
          onClick={() => dispatch(setSidebar())}
        />
        <Link to="/">
          <HiOutlineHome className="text-4xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 hover:ease-in-out cursor-pointer" />
        </Link>
        <div className="text-xl dark:text-whiteSecondary text-blackPrimary">
          TRANG QUẢN TRỊ COOLMAN.ME - WEBSITE THỜI TRANG VÀ PHỤ KIỆN NAM
        </div>
        <div className="flex gap-4 items-center max-xl:justify-center">
          {darkMode ? (
            <HiOutlineSun
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          ) : (
            <HiOutlineMoon
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          )}
          <Link to="/profile">
            <div className="flex gap-2 items-center">
              <img
                src={user.avatar}
                alt="profile"
                className="rounded-full w-10 h-10"
              />
              <div className="flex flex-col">
                <p className="dark:text-whiteSecondary text-blackPrimary text-base max-xl:text-sm">
                  {user.fullName}
                </p>
                <p className="dark:text-whiteSecondary text-blackPrimary text-sm max-xl:text-xs">
                  {user.role} {/* Hiển thị role */}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
