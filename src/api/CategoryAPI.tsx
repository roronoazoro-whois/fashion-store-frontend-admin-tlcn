import axios from "axios";

// URL của API
const API_URL = "http://localhost:8080/category";

// Định nghĩa kiểu dữ liệu cho Category
interface Category {
  id: number;
  name: string;
  slug: string;
  _links: {
    self: {
      href: string;
    };
    category: {
      href: string;
    };
    products: {
      href: string;
    };
  };
}

// Định nghĩa kiểu dữ liệu cho kết quả phân trang (pagination)
interface CategoryPage {
  _embedded: {
    category: Category[];
  };
  _links: {
    first: { href: string };
    prev: { href: string };
    self: { href: string };
    next: { href: string };
    last: { href: string };
    profile: { href: string };
    search: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

class CategoryAPI {
  // Lấy danh sách categories với phân trang
  static async getCategories(page = 0, size = 15): Promise<CategoryPage> {
    try {
      const response = await axios.get<CategoryPage>(
        `${API_URL}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Lấy category theo ID
  static async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await axios.get<Category>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }
}

export default CategoryAPI;
