import axios from "axios";

// URL cơ bản của API
const BASE_URL = "http://localhost:8080/product"; // Đã sửa đúng endpoint cho sản phẩm

// Định nghĩa kiểu dữ liệu cho hình ảnh
interface Image {
  id: number;
  url: string;
  altText: string | null;
  thumbnail: boolean;
}

// Định nghĩa kiểu dữ liệu cho màu sắc
interface Color {
  id: number;
  name: string;
  code: string;
}

// Định nghĩa kiểu dữ liệu cho kích thước
interface Size {
  id: number;
  name: string;
}

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  averageRating: number;
  description: string;
  brand: string;
  detail: string | null;
  createdAt: string;
  deleted: boolean;
  quantity: number;
  _links: {
    self: { href: string };
    images: { href: string };
    sizes: { href: string };
    colors: { href: string };
  };
}

// Định nghĩa kiểu dữ liệu cho phân trang sản phẩm
interface ProductPage {
  _embedded: {
    product: Product[];
  };
  _links: {
    self: { href: string };
    first: { href: string };
    prev: { href: string };
    next: { href: string };
    last: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

// Lấy danh sách sản phẩm với phân trang
export const getProductsWithPagination = async (
  page = 0,
  size = 5
): Promise<ProductPage> => {
  try {
    const response = await axios.get<ProductPage>(
      `${BASE_URL}/search/findByDeletedFalse?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Lấy danh sách hình ảnh theo ID sản phẩm
export const getImagesByProductId = async (
  productId: number
): Promise<Image[]> => {
  try {
    const response = await axios.get<{ _embedded: { image: Image[] } }>(
      `${BASE_URL}/${productId}/images`
    );
    return response.data._embedded.image;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Lấy kích thước của sản phẩm theo ID
export const getSizesByProductId = async (
  productId: number
): Promise<Size[]> => {
  try {
    const response = await axios.get<{ _embedded: { size: Size[] } }>(
      `${BASE_URL}/${productId}/sizes`
    );
    return response.data._embedded.size;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    throw error;
  }
};

// Lấy màu sắc của sản phẩm theo ID
export const getColorsByProductId = async (
  productId: number
): Promise<Color[]> => {
  try {
    const response = await axios.get<{ _embedded: { color: Color[] } }>(
      `${BASE_URL}/${productId}/colors`
    );
    return response.data._embedded.color;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
};

const BASE_URL2 = "http://localhost:8080/products"; // Đã sửa đúng endpoint cho sản phẩm

// ------------------------ API Gọi Để Tạo Mới Sản Phẩm ------------------------

// Định nghĩa kiểu dữ liệu cho DTO ProductCreate
interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  salePrice: number;
  categorySlugs: string[];
  colorNames: string[];
  sizeNames: string[];
}

// Định nghĩa kiểu dữ liệu cho phản hồi khi tạo sản phẩm
interface CreateProductResponse {
  message: string;
  success: boolean;
  data: number; // ID sản phẩm mới
}

// Tạo sản phẩm mới
export const createProduct = async (
  productCreateDto: ProductCreateDto,
  token: string // Thêm token vào tham số hàm
) => {
  try {
    const response = await axios.post<CreateProductResponse>(
      `${BASE_URL2}/create`,
      productCreateDto,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header
        },
      }
    );

    if (response.data.success) {
      console.log(
        "Sản phẩm đã được tạo thành công với ID:",
        response.data.data
      );
      return response.data.data; // Trả về ID sản phẩm mới
    } else {
      console.error("Tạo sản phẩm thất bại:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    throw error;
  }
};

// ------------------------ API Gọi Để Tạo Mới Ảnh Cho Sản Phẩm ------------------------

// Định nghĩa kiểu dữ liệu cho phản hồi khi tạo ảnh
interface CreateProductImagesResponse {
  message: string;
  success: boolean;
  data: null;
}

// Định nghĩa kiểu dữ liệu cho DTO tạo ảnh
interface CreateProductImagesDto {
  imageUrls: string[];
}

// Tạo ảnh cho sản phẩm
// Tạo ảnh cho sản phẩm
export const createProductImages = async (
  productId: number,
  imageUrls: string[],
  token: string // Thêm token vào tham số hàm
): Promise<void> => {
  const requestDto: CreateProductImagesDto = {
    imageUrls: imageUrls,
  };

  try {
    const response = await axios.post<CreateProductImagesResponse>(
      `${BASE_URL2}/${productId}/images`,
      requestDto,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header
        },
      }
    );

    if (response.data.success) {
      console.log("Tạo ảnh cho sản phẩm thành công");
    } else {
      console.error("Tạo ảnh cho sản phẩm thất bại:", response.data.message);
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi tạo ảnh cho sản phẩm:", error);
    throw error;
  }
};

// API Gọi Để Xóa Mềm Sản Phẩm
export const softDeleteProduct = async (
  productId: number,
  token: string
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${BASE_URL2}/delete/${productId}`, // Địa chỉ API xóa sản phẩm
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header
        },
      }
    );

    if (response.data.success) {
      console.log(`Sản phẩm với ID ${productId} đã được xóa thành công`);
    } else {
      console.error(
        `Xóa sản phẩm với ID ${productId} thất bại:`,
        response.data.message
      );
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error;
  }
};
