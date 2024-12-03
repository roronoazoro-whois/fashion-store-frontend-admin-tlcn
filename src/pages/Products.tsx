import { useEffect, useState } from "react"; // Import useState và useEffect
import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom
import { Pagination, ProductTable, Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import { getProductsWithPagination } from "../api/ProductAPI"; // Import hàm gọi API

// Định nghĩa kiểu Product
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

const Products = () => {
  const navigate = useNavigate(); // Khai báo hàm navigate để điều hướng
  const [currentPage, setCurrentPage] = useState(0); // State để theo dõi trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // State để theo dõi tổng số trang
  const [products, setProducts] = useState<Product[]>([]); // State để lưu danh sách sản phẩm

  // Hàm thay đổi trang
  const handlePageChange = async (page: number) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Lấy dữ liệu sản phẩm khi trang thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsWithPagination(currentPage, 15); // Lấy dữ liệu 15 sản phẩm mỗi trang
        setProducts(data._embedded.product); // Cập nhật danh sách sản phẩm
        setTotalPages(data.page.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentPage]); // Gọi lại khi trang thay đổi

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tất cả sản phẩm
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton
                onClick={() => navigate("/products/create-product")}
                text="Thêm sản phẩm"
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
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
          </div>
          {/* Hiển thị bảng sản phẩm với dữ liệu từ API */}
          <ProductTable products={products} />
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
