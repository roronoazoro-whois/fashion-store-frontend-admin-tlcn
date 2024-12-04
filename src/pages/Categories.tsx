import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryTable, Pagination, Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus } from "react-icons/hi";
import CategoryAPI from "../api/CategoryAPI";

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

  // Lấy danh sách categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryAPI.getCategories(currentPage, 15); // Gọi API với phân trang
        setCategories(data._embedded.category);
        setTotalPages(data.page.totalPages);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [currentPage]); // Chạy lại mỗi khi currentPage thay đổi

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
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
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Nhập tên danh mục"
              />
            </div>
          </div>
          <CategoryTable categories={categories} />
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
