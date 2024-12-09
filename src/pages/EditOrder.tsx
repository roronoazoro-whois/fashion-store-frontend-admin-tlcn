import { Sidebar } from "../components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../api/OrderAPI"; // Import hàm gọi API
import { getUserFromLocalStorage } from "../utils/authUtils";
import { getProductById, getImagesByProductId } from "../api/ProductAPI"; // Import API sản phẩm

import {
  OrderData,
  OrderStatus,
  OrderItem,
  PriceDetails,
  ShippingAddress,
} from "../api/OrderAPI"; // Import các kiểu dữ liệu

const EditOrder = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null); // Thay đổi kiểu dữ liệu từ any thành OrderData
  const [loading, setLoading] = useState<boolean>(true); // Đảm bảo rằng loading là kiểu boolean
  const [productDetails, setProductDetails] = useState<
    Map<number, { name: string; imageUrl: string }>
  >(new Map()); // Lưu trữ tên và hình ảnh sản phẩm
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Trạng thái đã chọn
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // Cờ để kiểm tra khi đang cập nhật trạng thái
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Lưu trữ thông báo lỗi
  const user = getUserFromLocalStorage();
  const token = user ? user.token : "";

  // Lấy dữ liệu đơn hàng khi component mount
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id as string, token); // Gọi API lấy thông tin đơn hàng
        setOrderData(data);
        setSelectedStatus(data.orderStatusDetails[0]?.statusName || ""); // Chọn trạng thái đầu tiên
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [id, token]);

  // Lấy thông tin sản phẩm khi cần
  useEffect(() => {
    const fetchProductDetails = async (productId: number) => {
      try {
        // Lấy thông tin sản phẩm
        const product = await getProductById(productId);

        // Lấy hình ảnh sản phẩm và chọn thumbnail (nếu có)
        const images = await getImagesByProductId(productId);
        const thumbnailImage =
          images.find((image) => image.thumbnail) || images[0]; // Ưu tiên ảnh thumbnail

        // Cập nhật trạng thái với tên sản phẩm và hình ảnh
        setProductDetails((prev) =>
          new Map(prev).set(productId, {
            name: product.name,
            imageUrl: thumbnailImage ? thumbnailImage.url : "",
          })
        );
      } catch (error) {
        console.error(
          `Error fetching product details for ID ${productId}:`,
          error
        );
      }
    };

    if (orderData) {
      orderData.items.forEach((item) => {
        if (!productDetails.has(item.productId)) {
          fetchProductDetails(item.productId);
        }
      });
    }
  }, [orderData, productDetails]);

  // Hàm hiển thị tình trạng đơn hàng, sắp xếp theo thời gian (tình trạng mới nhất lên đầu)
  const renderOrderStatuses = (statuses: OrderStatus[]) => {
    if (!statuses || statuses.length === 0) return null;

    // Sắp xếp tình trạng theo thời gian update (mới nhất lên đầu)
    const sortedStatuses = statuses.sort(
      (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()
    );

    return (
      <div>
        <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
          Trạng thái đơn hàng
        </h3>
        <div className="mt-4">
          {sortedStatuses.map((status, index) => (
            <div
              key={index}
              className={`border-b py-2 ${
                index === 0 ? "bg-blue-100 dark:bg-blue-700" : ""
              }`} // Nổi bật trạng thái mới nhất
            >
              <span
                className={`font-bold ${
                  index === 0
                    ? "text-blue-800 dark:text-blue-200"
                    : "text-black"
                }`}
              >
                {status.statusName}
              </span>
              <p
                className={`${
                  index === 0
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-700"
                }`}
              >
                {status.description}
              </p>
              <p
                className={`text-sm ${
                  index === 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500"
                }`}
              >
                Updated at: {new Date(status.updateAt).toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  index === 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500"
                }`}
              >
                Updated By: {status.updatedBy}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Hàm hiển thị sản phẩm trong đơn hàng
  const renderOrderItems = (items: OrderItem[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div>
        <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
          Sản phẩm
        </h3>
        <div className="mt-4">
          {items.map((item, index) => {
            const productInfo = productDetails.get(item.productId); // Lấy thông tin sản phẩm từ state

            return (
              <div key={index} className="border-b py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {/* Hiển thị ảnh sản phẩm nếu có */}
                    {productInfo?.imageUrl ? (
                      <img
                        src={productInfo.imageUrl}
                        alt={productInfo.name}
                        className="w-12 h-12"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-white">
                        No Image
                      </div>
                    )}
                    <span className="dark:text-whiteSecondary text-blackPrimary">
                      {productInfo?.name || `Product ${item.productId}`}
                    </span>
                  </div>
                  <span className="dark:text-whiteSecondary text-blackPrimary">
                    {`Số lượng: ${item.quantity}`}
                  </span>
                </div>

                {/* Hiển thị thêm các thuộc tính khác của sản phẩm */}
                <div className="mt-3">
                  {item.size && (
                    <div className="flex justify-between">
                      <span className="dark:text-whiteSecondary text-blackPrimary">
                        Kích thước
                      </span>
                      <span className="dark:text-whiteSecondary text-blackPrimary">
                        {item.size}
                      </span>
                    </div>
                  )}

                  {item.color && (
                    <div className="flex justify-between">
                      <span className="dark:text-whiteSecondary text-blackPrimary">
                        Màu sắc
                      </span>
                      <span className="dark:text-whiteSecondary text-blackPrimary">
                        {item.color}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="dark:text-whiteSecondary text-blackPrimary">
                      Giá
                    </span>
                    <span className="dark:text-whiteSecondary text-blackPrimary">
                      {item.price.toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Hàm hiển thị thông tin chi phí của đơn hàng
  const renderPriceDetails = (priceDetails: PriceDetails) => {
    if (!priceDetails) return null;
    return (
      <div>
        <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
          Thông tin chi phí
        </h3>
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="dark:text-whiteSecondary text-blackPrimary">
              Tổng tiền sản phẩm
            </span>
            <span className="dark:text-whiteSecondary text-blackPrimary">
              {priceDetails.subTotal} VND
            </span>
          </div>
          <div className="flex justify-between">
            <span className="dark:text-whiteSecondary text-blackPrimary">
              Phí vận chuyển
            </span>
            <span className="dark:text-whiteSecondary text-blackPrimary">
              {priceDetails.shipping} VND
            </span>
          </div>
          <div className="flex justify-between">
            <span className="dark:text-whiteSecondary text-blackPrimary">
              Giảm giá
            </span>
            <span className="dark:text-whiteSecondary text-blackPrimary">
              {priceDetails.discount} VND
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span className="dark:text-whiteSecondary text-blackPrimary">
              Tổng tiền
            </span>
            <span className="dark:text-whiteSecondary text-blackPrimary">
              {priceDetails.total} VND
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Hàm hiển thị thông tin địa chỉ nhận hàng
  const renderShippingAddress = (shippingAddress: ShippingAddress) => {
    if (!shippingAddress) return null;
    return (
      <div>
        <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
          Thông tin nhận hàng
        </h3>
        <div className="mt-4">
          <p className="dark:text-whiteSecondary text-blackPrimary">
            {shippingAddress.fullName}
          </p>
          <p className="dark:text-whiteSecondary text-blackPrimary">
            {shippingAddress.phoneNumber}
          </p>
          <p className="dark:text-whiteSecondary text-blackPrimary">
            {shippingAddress.address}
          </p>
          <p className="dark:text-whiteSecondary text-blackPrimary">
            {shippingAddress.district}, {shippingAddress.city},{" "}
            {shippingAddress.ward}
          </p>
        </div>
      </div>
    );
  };

  // Danh sách các trạng thái có thể chọn
  const orderStatusOptions = [
    {
      code: "PENDING",
      status_name: "Chờ xác nhận",
      description: "Đơn hàng đang chờ xác nhận từ người bán.",
    },
    {
      code: "READY_FOR_PICKUP",
      status_name: "Chờ lấy hàng",
      description: "Đơn hàng đã được chuẩn bị sẵn sàng để lấy.",
    },
    {
      code: "OUT_FOR_DELIVERY",
      status_name: "Chờ giao hàng",
      description: "Đơn hàng đang trên đường giao tới khách hàng.",
    },
    {
      code: "DELIVERED",
      status_name: "Đã giao",
      description: "Đơn hàng đã được giao tới khách hàng.",
    },
    {
      code: "CANCELLED",
      status_name: "Đã hủy",
      description: "Đơn hàng đã bị hủy.",
    },
  ];

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedStatus || isUpdating) return;

    setIsUpdating(true);
    setErrorMessage(null);

    try {
      // Gọi API để cập nhật trạng thái
      await updateOrderStatus(id as string, selectedStatus, token);
      // Sau khi cập nhật trạng thái thành công, gọi lại useEffect để tải lại thông tin đơn hàng
      const data = await getOrderById(id as string, token);
      setOrderData(data);
    } catch (error) {
      setErrorMessage("Lỗi cập nhật trạng thái đơn hàng");
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang lấy dữ liệu
  }

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin đơn hàng
              </h2>
            </div>
          </div>

          {/* Hiển thị thông tin đơn hàng */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Left div */}
            <div>
              {orderData && (
                <>
                  {renderOrderStatuses(orderData.orderStatusDetails)}
                  {renderOrderItems(orderData.items)} {/* Chỉnh sửa ở đây */}
                </>
              )}
            </div>

            {/* Right div */}
            <div className="space-y-5">
              {orderData && (
                <>
                  {renderPriceDetails(orderData.priceDetails)}
                  {renderShippingAddress(orderData.shippingAddress)}

                  {/* Khu vực cập nhật trạng thái */}
                  <div className="mt-6">
                    <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                      Cập nhật trạng thái đơn hàng
                    </h3>
                    <div className="mt-4 flex gap-4">
                      <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="p-2 border rounded-lg"
                      >
                        {orderStatusOptions.map((status, index) => (
                          <option key={index} value={status.code}>
                            {status.status_name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleConfirmStatusChange}
                        className="p-2 bg-blue-600 text-white rounded-lg"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Đang cập nhật..." : "Xác nhận"}
                      </button>
                    </div>
                    {errorMessage && (
                      <div className="mt-4 text-red-600">{errorMessage}</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
