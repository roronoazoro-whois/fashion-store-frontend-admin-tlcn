import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineEye } from "react-icons/hi";

// Định nghĩa kiểu dữ liệu của đơn hàng
interface OrderSummary {
  id: number;
  orderDate: string;
  total: number;
  currentStatus: string;
}

interface OrderTableProps {
  orders: OrderSummary[]; // Dữ liệu đơn hàng nhận từ props
}

const OrderTable = ({ orders }: OrderTableProps) => {
  // Hàm để chọn màu sắc cho tình trạng đơn hàng
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-500 text-white";
      case "Chờ giao hàng":
        return "bg-yellow-500 text-white";
      case "Chờ xác nhận":
        return "bg-blue-500 text-white";
      case "Chờ lấy hàng":
        return "bg-orange-500 text-white";
      case "Đã hủy":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-1/12" />
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
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
            Mã đơn hàng
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Tình trạng
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Tổng tiền
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20"
          >
            Ngày khởi tạo
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
          >
            Hành động
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {orders.map((order, index) => (
          <tr key={nanoid()}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                {index + 1} {/* Số thứ tự */}
              </div>
            </td>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                #{order.id} {/* Thêm dấu # trước mã đơn hàng */}
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 table-cell pr-8">
              <div
                className={`text-sm leading-6 py-1 px-2 font-semibold ${getStatusClass(
                  order.currentStatus
                )}`}
              >
                {order.currentStatus}
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="text-sm font-medium text-blackPrimary dark:text-whiteSecondary">
                {order.total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell lg:pr-20">
              {order.orderDate}
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to={`/orders/${order.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link
                  to={`/orders/${order.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlineEye className="text-lg" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
