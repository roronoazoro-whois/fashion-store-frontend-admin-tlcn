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
