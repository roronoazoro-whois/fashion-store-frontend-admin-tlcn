import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryTable, Pagination, Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus } from "react-icons/hi";
import CategoryAPI from "../api/CategoryAPI";
import { getUserFromLocalStorage } from "../utils/authUtils";
import { toast } from "react-toastify";

// Định nghĩa kiểu Category ngay trong file này
interface Category {
  id: number;
  name: string;
  slug: string;
}

const Categories = () => {
  const navigate = useNavigate();

  // State để lưu thông tin danh mục và phân trang
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null); // ID danh mục cần xóa

  // Hàm lấy danh sách categories từ API
  const fetchCategories = async (page: number) => {
    try {
      const data = await CategoryAPI.getCategories(page, 15); // Gọi API với phân trang
      setCategories(data._embedded.category);
      setTotalPages(data.page.totalPages);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Lấy danh sách categories khi trang thay đổi hoặc lần đầu tiên
  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]); // Chạy lại mỗi khi currentPage thay đổi

  // Hàm xử lý xóa danh mục
  const deleteCategory = async (categoryId: number) => {
    try {
      const token = getUserFromLocalStorage()?.token;
      if (!token) {
        throw new Error("Token is undefined");
      }
      // Gọi API để xóa danh mục
      await CategoryAPI.deleteCategory(categoryId, token);

      // Cập nhật lại danh sách categories sau khi xóa (tải lại từ API)
      toast.success("Đã xóa danh mục thành công");

      // Tải lại danh sách categories sau khi xóa thành công
      fetchCategories(currentPage);

      // Kiểm tra xem danh sách sau khi xóa có còn danh mục hay không
      if (categories.length === 1 && currentPage > 0) {
        // Nếu chỉ còn 1 danh mục và bạn đang ở trang > 0 thì chuyển về trang trước đó
        setCurrentPage(currentPage - 1);
      }

      // Đóng modal sau khi xóa
      closeModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa danh mục");
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  // Hàm mở modal
  const openModal = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tất cả danh mục
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton
                onClick={() => navigate("/categories/create-category")}
                text="Thêm danh mục"
                textSize="lg"
                py="2"
                width="48"
              >
                <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
              </WhiteButton>
            </div>
          </div>

          {/* Hiển thị bảng danh mục */}
          <CategoryTable
            categories={categories}
            onDeleteCategory={openModal} // Truyền hàm openModal vào để mở modal khi bấm xóa
          />

          {/* Modal xác nhận xóa */}
          {isModalOpen && categoryToDelete !== null && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Bạn có chắc muốn xóa danh mục này?
                </h3>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() =>
                      categoryToDelete && deleteCategory(categoryToDelete)
                    } // Xóa danh mục khi xác nhận
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage} // Cập nhật trang khi thay đổi
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
