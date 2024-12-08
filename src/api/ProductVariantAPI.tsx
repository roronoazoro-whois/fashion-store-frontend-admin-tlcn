import axios from "axios";

// URL cơ bản của API
const BASE_URL = "http://localhost:8080/product-variant";

// Định nghĩa kiểu dữ liệu cho các variant
interface ProductVariantRequest {
  colorName: string;
  sizeName: string;
  quantity: number;
}

// Định nghĩa kiểu dữ liệu cho phản hồi khi tạo ProductVariant
interface ProductVariantResponse {
  message: string;
  success: boolean;
  data: null;
}

// Định nghĩa kiểu dữ liệu cho yêu cầu tạo ProductVariant
interface CreateProductVariantsRequest {
  variants: ProductVariantRequest[];
}

// Định nghĩa kiểu dữ liệu cho phản hồi lấy số lượng sản phẩm
interface ProductQuantityResponse {
  message: string;
  success: boolean;
  data: number;
}

// Tạo các variants cho một sản phẩm
export const createProductVariants = async (
  productId: number,
  variants: ProductVariantRequest[],
  token: string // Thêm token vào tham số hàm
): Promise<void> => {
  const requestDto: CreateProductVariantsRequest = {
    variants: variants,
  };

  try {
    const response = await axios.post<ProductVariantResponse>(
      `${BASE_URL}/${productId}/variants`,
      requestDto,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header
        },
      }
    );

    if (response.data.success) {
      console.log("Tạo ProductVariant thành công");
    } else {
      console.error("Tạo ProductVariant thất bại:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi tạo ProductVariant:", error);
    throw error;
  }
};

export const updateProductVariants = async (
  productId: number,
  variants: ProductVariantRequest[],
  token: string // Thêm token vào tham số hàm
): Promise<void> => {
  const requestDto: CreateProductVariantsRequest = {
    variants: variants,
  };

  try {
    const response = await axios.put<ProductVariantResponse>(
      `${BASE_URL}/${productId}/variants`,
      requestDto,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header
        },
      }
    );

    if (response.data.success) {
      console.log("Cập nhật ProductVariant thành công");
    } else {
      console.error("Cập nhật ProductVariant thất bại:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật ProductVariant:", error);
    throw error;
  }
};

// Hàm gọi API lấy số lượng sản phẩm
export const getProductQuantity = async (
  productId: number,
  colorName: string,
  sizeName: string
): Promise<number> => {
  try {
    // Gọi API lấy số lượng sản phẩm
    const response = await axios.get<ProductQuantityResponse>(
      `${BASE_URL}/quantity`,
      {
        params: { productId, colorName, sizeName },
      }
    );

    if (response.data.success) {
      // Trả về số lượng sản phẩm
      console.log("Số lượng sản phẩm:", response.data.data);
      return response.data.data;
    } else {
      console.error("Lỗi khi lấy số lượng sản phẩm:", response.data.message);
      return 0; // Trả về 0 nếu có lỗi
    }
  } catch (error) {
    console.error("Lỗi khi gọi API lấy số lượng sản phẩm:", error);
    throw error;
  }
};
