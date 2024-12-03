import axios from "axios";

// URL cơ bản của API
const BASE_URL = "http://localhost:8080/product";

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
      `${BASE_URL}?page=${page}&size=${size}`
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
