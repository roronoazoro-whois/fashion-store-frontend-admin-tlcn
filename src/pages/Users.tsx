import { useEffect, useState } from "react"; // Import hook
import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
import { Pagination, Sidebar, UserTable, WhiteButton } from "../components";
import { getUsersList } from "../api/UserAPI"; // Import API lấy danh sách người dùng
import { getUserFromLocalStorage } from "../utils/authUtils"; // Import hàm lấy token từ localStorage
import { UsersListResponse } from "../api/UserAPI"; // Import kiểu dữ liệu từ API

const Users = () => {
  const [usersData, setUsersData] = useState<UsersListResponse["data"] | null>(
    null
  ); // State lưu dữ liệu người dùng và thông tin phân trang
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [searchTerm, setSearchTerm] = useState(""); // Từ khoá tìm kiếm người dùng
  const navigate = useNavigate(); // Khai báo hàm navigate để điều hướng

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getUserFromLocalStorage()?.token;
        if (!token) {
          throw new Error("Token is undefined");
        }
        const data = await getUsersList(currentPage, 15, token); // Lấy danh sách người dùng từ API
        setUsersData(data.data); // Cập nhật dữ liệu bao gồm danh sách người dùng và thông tin phân trang
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, searchTerm]); // Lấy lại dữ liệu khi trang hoặc từ khoá tìm kiếm thay đổi

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Cập nhật trang khi thay đổi
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Danh sách người dùng
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton
                onClick={() => navigate("/users/create-user")} // Điều hướng tới trang thêm người dùng
                text="Thêm người dùng"
                textSize="lg"
                py="2"
                width="48"
              >
                <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
              </WhiteButton>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Nhập email người dùng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khoá tìm kiếm
              />
            </div>
          </div>
          {usersData && <UserTable users={usersData.content} />}{" "}
          {/* Truyền dữ liệu người dùng vào bảng */}
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
            <Pagination
              currentPage={currentPage}
              totalPages={usersData?.totalPages || 0} // Sử dụng totalPages từ usersData
              onPageChange={handlePageChange} // Cập nhật trang khi phân trang
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
