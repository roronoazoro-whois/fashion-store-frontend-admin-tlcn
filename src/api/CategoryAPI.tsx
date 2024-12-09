import axios from "axios";

// URL của API
const API_URL = "http://localhost:8080/category";
const API_URL2 = "http://localhost:8080/categories";

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

// Định nghĩa DTO để tạo danh mục mới
interface CategoryCreateDto {
  name: string;
  slug: string;
}

// API xử lý các request liên quan đến category
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

  // Tạo mới một danh mục
  static async createCategory(
    categoryCreateDto: CategoryCreateDto,
    token: string
  ): Promise<Category> {
    try {
      const response = await axios.post<Category>(
        `${API_URL2}/create`,
        categoryCreateDto,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  // Cập nhật thông tin category
  static async updateCategory(
    id: number,
    categoryCreateDto: CategoryCreateDto,
    token: string
  ): Promise<Category> {
    try {
      const response = await axios.put<Category>(
        `${API_URL}/${id}`,
        categoryCreateDto,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  // Xóa category theo ID
  static async deleteCategory(id: number, token: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }
}

export default CategoryAPI;
