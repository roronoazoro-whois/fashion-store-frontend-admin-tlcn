import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getUserInfoByUsername,
  toggleUserAccount,
  updateUserRole,
} from "../api/UserAPI";
import { InputWithLabel, Sidebar, SimpleInput } from "../components";
import { getUserFromLocalStorage } from "../utils/authUtils";
import { FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify"; // Import toastify để sử dụng thông báo

const EditUser = () => {
  const { email } = useParams();
  const [inputObject, setInputObject] = useState({
    fullName: "",
    email: "",
    role: "",
    avatar: "",
    phoneNumber: "",
  });
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false); // Trạng thái loading cho nút cập nhật
  const [active, setActive] = useState(false); // Trạng thái khóa tài khoản
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal

  // Hàm gọi API lấy thông tin người dùng
  const fetchUserInfo = async () => {
    if (email) {
      try {
        const token = getUserFromLocalStorage()?.token;
        if (!token) {
          console.error("Token không hợp lệ");
          return;
        }

        const userData = await getUserInfoByUsername(email, token);
        setInputObject({
          fullName: userData.fullName || "Chưa cập nhật",
          email: userData.email || "Chưa cập nhật",
          role: userData.roleName || "Chưa cập nhật",
          avatar:
            userData.avatar ||
            "https://res.cloudinary.com/doo4qviqi/image/upload/v1730703669/defaultavatar_uhpwxn.png",
          phoneNumber: userData.phoneNumber || "Chưa cập nhật",
        });

        // Cập nhật quyền người dùng
        setRole(userData.roleName || "USER");
        setActive(userData.active); // Cập nhật trạng thái tài khoản
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  // Gọi API khi component load hoặc khi email thay đổi
  useEffect(() => {
    if (email) {
      fetchUserInfo();
    }
  }, [email]); // Lắng nghe email để gọi lại API mỗi khi email thay đổi

  const handleRoleUpdate = async () => {
    setLoading(true); // Bắt đầu trạng thái loading

    const token = getUserFromLocalStorage()?.token;
    if (!token) {
      console.error("Token không hợp lệ");
      setLoading(false); // Kết thúc trạng thái loading
      return;
    }

    if (email) {
      try {
        const message = await updateUserRole(email, role, token);
        toast.success(`${message}`); // Thông báo thành công

        // Sau khi cập nhật, fetch lại thông tin người dùng
        fetchUserInfo(); // Gọi lại API để lấy dữ liệu mới
      } catch (error: unknown) {
        // Kiểm tra nếu error là đối tượng Error
        if (error instanceof Error) {
          toast.error(`Cập nhật quyền thất bại: ${error.message}`); // Thông báo thất bại
        } else {
          toast.error("Cập nhật quyền thất bại: Lỗi không xác định"); // Thông báo lỗi không xác định
        }
      }
    } else {
      console.error("Email không hợp lệ");
      toast.error("Email không hợp lệ");
    }

    setLoading(false); // Kết thúc trạng thái loading
  };

  // Hàm xử lý khóa/mở khóa tài khoản
  const handleAccountLock = async () => {
    const token = getUserFromLocalStorage()?.token; // Lấy token từ localStorage
    if (!token) {
      console.error("Token không hợp lệ");
      toast.error("Token không hợp lệ");
      return;
    }

    if (email) {
      try {
        const message = await toggleUserAccount(email, token); // Gọi API để thay đổi trạng thái tài khoản
        toast.success(message); // Hiển thị thông báo thành công

        // Cập nhật lại trạng thái của tài khoản
        setActive(!active); // Đảo ngược trạng thái khóa tài khoản
      } catch (error: unknown) {
        // Kiểm tra nếu error là đối tượng Error
        if (error instanceof Error) {
          toast.error(`Thao tác thất bại: ${error.message}`); // Thông báo lỗi
        } else {
          toast.error("Thao tác thất bại: Lỗi không xác định"); // Thông báo lỗi không xác định
        }
      }
    }

    setShowModal(false); // Đóng modal sau khi thực hiện xong
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Left div */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin người dùng
              </h3>

              <div className="flex flex-col gap-5">
                <InputWithLabel label="Họ và tên">
                  <SimpleInput
                    type="text"
                    placeholder="Chưa cập nhật"
                    value={inputObject.fullName}
                    readOnly
                    className="bg-gray-100 text-blackSecondary cursor-not-allowed opacity-60 relative"
                  />
                  <FaShieldAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 opacity-70" />
                </InputWithLabel>
                <InputWithLabel label="Email">
                  <SimpleInput
                    type="email"
                    placeholder="Chưa cập nhật"
                    value={inputObject.email}
                    readOnly
                    className="bg-gray-100 text-blackSecondary cursor-not-allowed opacity-60 relative"
                  />
                  <FaShieldAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 opacity-70" />
                </InputWithLabel>
                <InputWithLabel label="Vai trò">
                  <SimpleInput
                    type="text"
                    placeholder="Chưa cập nhật"
                    value={inputObject.role}
                    readOnly
                    className="bg-gray-100 text-blackSecondary cursor-not-allowed opacity-60 relative"
                  />
                  <FaShieldAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 opacity-70" />
                </InputWithLabel>
                <InputWithLabel label="Số điện thoại">
                  <SimpleInput
                    type="text"
                    placeholder="Chưa cập nhật"
                    value={inputObject.phoneNumber}
                    readOnly
                    className="bg-gray-100 text-blackSecondary cursor-not-allowed opacity-60 relative"
                  />
                  <FaShieldAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 opacity-70" />
                </InputWithLabel>

                {/* Cập nhật quyền */}
                <InputWithLabel label="Cập nhật quyền">
                  <div className="relative flex items-center">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="USER">USER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      onClick={handleRoleUpdate}
                      disabled={loading} // Vô hiệu nút khi đang loading
                      className={`ml-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto whitespace-nowrap text-center ${
                        loading ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Loading" : "Cập nhật"}
                    </button>
                  </div>
                </InputWithLabel>

                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)} // Hiển thị modal
                    className={`px-6 py-2 rounded-md w-full sm:w-auto whitespace-nowrap text-center ${
                      active
                        ? "bg-red-700 hover:bg-red-600 text-white"
                        : "bg-green-600 hover:bg-green-500 text-white"
                    }`}
                  >
                    {active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right div */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Ảnh đại diện
              </h3>
              <div className="flex justify-center gap-x-2 mt-5 flex-wrap">
                <img
                  src={inputObject.avatar}
                  alt="User Avatar"
                  className="w-36 h-36 rounded-full border-2 border-gray-300 object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Người dùng tự cập nhật các thông tin của mình.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for locking/unlocking account */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h4 className="text-lg font-semibold mb-4">
              {active ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
            </h4>
            <p>
              Bạn có chắc chắn muốn {active ? "khóa" : "mở khóa"} tài khoản của
              người dùng này?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleAccountLock}
                className={`px-6 py-2 rounded-md ${
                  active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
