import axios from "axios";

// URL cơ bản của API
const BASE_URL = "http://localhost:8080/orders";

// Định nghĩa kiểu dữ liệu cho các sản phẩm trong đơn hàng
export interface OrderItem {
  productId: number;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

// Định nghĩa kiểu dữ liệu cho thông tin chi tiết giá
export interface PriceDetails {
  subTotal: number;
  shipping: number;
  discount: number;
  total: number;
}

// Định nghĩa kiểu dữ liệu cho địa chỉ giao hàng
export interface ShippingAddress {
  id: number | null;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  defaultAddress: boolean;
}

// Định nghĩa kiểu dữ liệu cho trạng thái đơn hàng
export interface OrderStatus {
  statusName: string;
  description: string;
  updateAt: string;
  updatedBy: string;
}

// Định nghĩa kiểu dữ liệu cho đơn hàng
export interface OrderData {
  items: OrderItem[];
  priceDetails: PriceDetails;
  shippingAddress: ShippingAddress;
  orderStatusDetails: OrderStatus[];
}

// Định nghĩa kiểu dữ liệu cho phản hồi từ API khi lấy thông tin đơn hàng
interface OrderResponse {
  message: string;
  success: boolean;
  data: OrderData;
}

// Định nghĩa kiểu dữ liệu cho thông tin đơn hàng trong danh sách
interface OrderSummary {
  id: number;
  orderDate: string;
  total: number;
  currentStatus: string;
}

// Định nghĩa kiểu dữ liệu cho phân trang
interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Định nghĩa kiểu dữ liệu cho phản hồi danh sách đơn hàng
interface OrdersListResponse {
  message: string;
  success: boolean;
  data: {
    content: OrderSummary[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

// Hàm gọi API để lấy thông tin đơn hàng theo orderId
export const getOrderById = async (
  orderId: string,
  token: string
): Promise<OrderData> => {
  try {
    // Đảm bảo token và orderId được truyền vào khi gọi API
    if (!token) {
      throw new Error("Token là bắt buộc!");
    }

    if (!orderId) {
      throw new Error("orderId là bắt buộc!");
    }

    // Thiết lập headers với Authorization Bearer token
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Gửi yêu cầu GET để lấy thông tin đơn hàng theo orderId
    const response = await axios.get<OrderResponse>(`${BASE_URL}/${orderId}`, {
      headers,
    });

    // Trả về dữ liệu đơn hàng nếu API trả về thành công
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Lỗi không xác định");
    }
  } catch (error) {
    // Kiểm tra lỗi từ server nếu có
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        throw new Error(error.response.data.message || "Lỗi không xác định");
      } else if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("Không thể kết nối đến server");
      }
    }
    console.error("Unexpected error:", error);
    throw new Error("Lỗi không xác định");
  }
};

export const getOrders = async (
  page: number = 1,
  size: number = 15,
  token: string
): Promise<OrdersListResponse["data"]> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get<OrdersListResponse>(
      `${BASE_URL}/all?page=${page + 1}&size=${size}`,
      { headers }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Lỗi không xác định");
    }
  } catch (error) {
    throw new Error("Lỗi không xác định");
  }
};

// Hàm gọi API để cập nhật trạng thái chi tiết đơn hàng
export const updateOrderStatus = async (
  orderId: string,
  statusCode: string,
  token: string
): Promise<string> => {
  try {
    // Đảm bảo token, orderId, và statusCode được truyền vào khi gọi API
    if (!token) {
      throw new Error("Token là bắt buộc!");
    }

    if (!orderId) {
      throw new Error("orderId là bắt buộc!");
    }

    if (!statusCode) {
      throw new Error("statusCode là bắt buộc!");
    }

    // Thiết lập headers với Authorization Bearer token
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Gửi yêu cầu POST để cập nhật trạng thái chi tiết đơn hàng
    const response = await axios.post<{
      message: string;
      success: boolean;
      data: null;
    }>(
      `${BASE_URL}/${orderId}/update-status?statusCode=${statusCode}`,
      {},
      { headers }
    );

    // Kiểm tra phản hồi và trả về thông báo từ server
    if (response.data.success) {
      return response.data.message;
    } else {
      throw new Error(response.data.message || "Lỗi không xác định");
    }
  } catch (error) {
    // Kiểm tra lỗi từ server nếu có
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        throw new Error(error.response.data.message || "Lỗi không xác định");
      } else if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("Không thể kết nối đến server");
      }
    }
    console.error("Unexpected error:", error);
    throw new Error("Lỗi không xác định");
  }
};
