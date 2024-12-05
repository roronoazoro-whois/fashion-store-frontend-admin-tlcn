import { HiOutlineHome } from "react-icons/hi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineTruck } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { HiOutlineX } from "react-icons/hi";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { HiOutlineUser } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { toast } from "react-toastify"; // Import toastify để sử dụng thông báo
import { ToastContainer } from "react-toastify"; // Import ToastContainer

const Sidebar = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Use navigate for page redirection

  // Accessing user context for logout
  const { logout } = useUser();

  // Determine the sidebar class based on isSidebarOpen
  const sidebarClass: string = isSidebarOpen
    ? "sidebar-open"
    : "sidebar-closed";

  const navActiveClass: string =
    "block dark:bg-whiteSecondary flex items-center self-stretch gap-4 py-4 px-6 cursor-pointer max-xl:py-3 dark:text-blackPrimary bg-white text-blackPrimary";
  const navInactiveClass: string =
    "block flex items-center self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary";

  const handleLogout = () => {
    toast.error("Đăng xuất thành công!"); // Thông báo thành công

    // Chờ một khoảng thời gian để thông báo có thể hiển thị, sau đó mới chuyển hướng
    setTimeout(() => {
      // Redirect to the login page after logout

      // Call the logout function from the UserContext
      logout();
      navigate("/login"); // Bạn có thể thay đổi đường dẫn nếu cần
    }, 700); // 1000ms = 1 giây (tùy chỉnh thời gian delay cho phù hợp)

    console.log("User logged out");
  };

  return (
    <div className="relative">
      <div
        className={`w-72 h-[100vh] dark:bg-blackPrimary bg-whiteSecondary pt-6 xl:sticky xl:top-0 xl:z-10 max-xl:fixed max-xl:top-0 max-xl:z-10 xl:translate-x-0 ${sidebarClass}`}
      >
        <HiOutlineX
          className="dark:text-whiteSecondary text-blackPrimary text-2xl ml-auto mb-2 mr-2 cursor-pointer xl:py-3"
          onClick={() => dispatch(setSidebar())}
        />
        <div>
          <NavLink
            to="/"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineHome className="text-xl" />
            <span className="text-lg">Tổng quan</span>
          </NavLink>

          <NavLink
            to="/products"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineDevicePhoneMobile className="text-xl" />
            <span className="text-lg">Sản phẩm</span>
          </NavLink>
          <NavLink
            to="/categories"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineTag className="text-xl" />
            <span className="text-lg">Danh mục</span>
          </NavLink>
          <NavLink
            to="/orders"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineTruck className="text-xl" />
            <span className="text-lg">Đơn hàng</span>
          </NavLink>
          <NavLink
            to="/users"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineUser className="text-xl" />
            <span className="text-lg">Người dùng</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="block flex items-center gap-4 py-4 px-6 dark:bg-red-600 bg-red-600 text-white cursor-pointer max-xl:py-3 rounded-lg transition-all duration-300 hover:bg-red-700 hover:shadow-lg ml-6 mr-6 mt-4 mb-4"
          >
            <HiOutlineUser className="text-xl" />
            <span className="text-lg">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
