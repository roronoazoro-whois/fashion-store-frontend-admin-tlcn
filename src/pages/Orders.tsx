import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { OrderTable, Pagination, Sidebar } from "../components";
import { getOrders } from "../api/OrderAPI"; // Import API lấy danh sách đơn hàng
import { getUserFromLocalStorage } from "../utils/authUtils";

interface OrderSummary {
  id: number;
  orderDate: string;
  total: number;
  currentStatus: string;
}

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(0); // Trang bắt đầu từ 1
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [orders, setOrders] = useState<OrderSummary[]>([]); // Trạng thái lưu danh sách đơn hàng
  const [searchQuery, setSearchQuery] = useState<string>(""); // Lưu giá trị mã đơn hàng tìm kiếm

  useEffect(() => {
    // Khi searchQuery thay đổi, reset currentPage về 0
    if (searchQuery) {
      setCurrentPage(0); // Reset currentPage về 0 khi bắt đầu tìm kiếm
    }
  }, [searchQuery]); // Effect này sẽ chạy khi searchQuery thay đổi

  useEffect(() => {
    console.log("Fetching orders for page:", currentPage);
    const fetchOrders = async () => {
      try {
        const token = getUserFromLocalStorage()?.token;
        if (!token) {
          throw new Error("Token is undefined");
        }
        const pageSize = searchQuery ? 200 : 15; // Điều chỉnh số lượng sản phẩm mỗi trang
        const data = await getOrders(currentPage, pageSize, token);
        console.log("Fetched orders:", data);
        setOrders(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [currentPage, searchQuery]); // Chạy lại khi `currentPage` hoặc `searchQuery` thay đổi

  // Hàm thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Cập nhật trang
  };

  // Hàm lọc đơn hàng theo mã đơn hàng
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  // Lọc đơn hàng theo mã đơn hàng (id)
  const filteredOrders = orders.filter((order) => {
    return order.id.toString().includes(searchQuery); // Tìm đơn hàng theo mã đơn hàng
  });

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tất cả đơn hàng
              </h2>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Nhập mã đơn hàng"
                value={searchQuery}
                onChange={handleSearchChange} // Cập nhật khi người dùng nhập mã đơn hàng
              />
            </div>
          </div>
          <OrderTable orders={filteredOrders} />{" "}
          {/* Hiển thị đơn hàng đã lọc */}
          {!searchQuery && ( // Chỉ hiển thị phân trang khi không có tìm kiếm
            <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
