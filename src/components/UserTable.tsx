import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";

// Định nghĩa kiểu dữ liệu của người dùng
interface User {
  fullName: string;
  avatar: string | null; // avatar có thể là null
  email: string | null;
  phoneNumber: string | null;
  roleName: string | null;
}

interface UserTableProps {
  users: User[]; // Dữ liệu người dùng nhận từ props
}

const UserTable = ({ users }: UserTableProps) => {
  const defaultAvatar =
    "https://res.cloudinary.com/doo4qviqi/image/upload/v1730703669/defaultavatar_uhpwxn.png"; // Đường dẫn avatar mặc định

  // Hàm trả về giá trị nếu nó là null
  const getValueOrPlaceholder = (
    value: string | null,
    placeholder: string = "Chưa cập nhật"
  ) => {
    return value ?? placeholder;
  };

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-1/12" /> {/* Cột STT */}
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>
      <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            STT
          </th>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Người dùng
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Email
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Vai trò
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20"
          >
            Số điện thoại
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
          ></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {users.map((user, index) => (
          <tr key={nanoid()}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-center">
              {index + 1} {/* Hiển thị STT, bắt đầu từ 1 */}
            </td>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <img
                  src={user.avatar ?? defaultAvatar} // Nếu avatar là null, sử dụng ảnh mặc định
                  alt="Avatar"
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {getValueOrPlaceholder(user.fullName)}{" "}
                  {/* Nếu fullName là null, hiển thị "Chưa cập nhật" */}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 table-cell pr-8">
              <div className="flex gap-x-3">
                <div className="text-sm leading-6 py-1 dark:text-whiteSecondary text-blackPrimary">
                  {getValueOrPlaceholder(user.email)}{" "}
                  {/* Nếu email là null, hiển thị "Chưa cập nhật" */}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="dark:text-whiteSecondary text-blackPrimary block font-medium">
                {getValueOrPlaceholder(user.roleName)}{" "}
                {/* Nếu roleName là null, hiển thị "Chưa cập nhật" */}
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell">
              <div className="truncate">
                {getValueOrPlaceholder(user.phoneNumber)}{" "}
                {/* Nếu phoneNumber là null, hiển thị "Chưa cập nhật" */}
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-right text-sm leading-6">
              <Link
                to={`/users/${user.email}`} // Đảm bảo đường dẫn chính xác
                className="inline-block dark:text-whiteSecondary text-blackPrimary hover:text-blackSecondary"
              >
                <HiOutlinePencil />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
