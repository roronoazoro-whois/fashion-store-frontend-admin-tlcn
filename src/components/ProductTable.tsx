import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getImagesByProductId } from "../api/ProductAPI"; // Đảm bảo bạn import đúng API
import { getUserFromLocalStorage } from "../utils/authUtils";

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

interface ProductTableProps {
  products: Product[];
  onProductDelete: (productId: number) => void; // Thêm props để xử lý xóa sản phẩm
}

const inStockClass: string =
  "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
const outOfStockClass: string =
  "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";

const ProductTable = ({ products, onProductDelete }: ProductTableProps) => {
  const [productImages, setProductImages] = useState<{ [key: number]: string }>(
    {}
  );
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false); // Để quản lý modal
  const [productToDelete, setProductToDelete] = useState<number | null>(null); // Để lưu id sản phẩm cần xóa
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi xóa

  useEffect(() => {
    // Lấy ảnh cho tất cả các sản phẩm
    products.forEach((product) => {
      getImagesByProductId(product.id).then((images) => {
        // Tìm ảnh thumbnail nếu có
        const thumbnailImage = images.find((image) => image.thumbnail);
        // Nếu có ảnh thumbnail, lưu ảnh đó, nếu không thì chọn ảnh đầu tiên
        setProductImages((prev) => ({
          ...prev,
          [product.id]: thumbnailImage ? thumbnailImage.url : images[0]?.url,
        }));
      });
    });
  }, [products]);

  // Hàm xử lý khi nhấn vào icon giỏ rác
  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId); // Lưu id sản phẩm cần xóa
    setShowConfirmModal(true); // Hiển thị modal xác nhận
  };

  // Hàm xác nhận xóa sản phẩm
  const handleConfirmDelete = async () => {
    if (productToDelete !== null) {
      try {
        setLoading(true); // Bật loading
        const token = getUserFromLocalStorage()?.token;
        if (!token) {
          throw new Error("Token is undefined");
        }
        onProductDelete(productToDelete); // Gọi hàm xóa sản phẩm
        setShowConfirmModal(false); // Ẩn modal
        setProductToDelete(null); // Reset product id
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      } finally {
        setLoading(false); // Tắt loading
      }
    }
  };

  // Hàm hủy bỏ xóa sản phẩm
  const handleCancelDelete = () => {
    setShowConfirmModal(false); // Đóng modal xác nhận
    setProductToDelete(null); // Reset product id
  };

  return (
    <div>
      {/* Hiển thị modal xác nhận */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold">Xác nhận xóa sản phẩm</h3>
            <p className="mt-2">Bạn có chắc chắn muốn xóa sản phẩm này?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleConfirmDelete}
                disabled={loading} // Vô hiệu hóa nút khi đang loading
              >
                {loading ? "Đang xóa..." : "Xóa"}{" "}
                {/* Hiển thị thông báo loading */}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={handleCancelDelete}
                disabled={loading} // Vô hiệu hóa nút khi đang loading
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
        <colgroup>
          <col className="w-1/12" />
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              STT
            </th>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Tên sản phẩm
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Giá gốc
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Giá khuyến mãi
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Tình trạng
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((item, index) => (
            <tr key={nanoid()}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {index + 1}
                </div>
              </td>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <img
                    src={productImages[item.id] || "/default-image.jpg"}
                    alt={item.name}
                    className="h-8 w-8 rounded-full bg-gray-800"
                  />
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {item.name}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 table-cell pr-8">
                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.salePrice === 0
                    ? "Không khuyến mãi"
                    : item.salePrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div className="flex items-center gap-x-2 justify-start">
                  <div
                    className={
                      item.quantity > 0 ? inStockClass : outOfStockClass
                    }
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="dark:text-whiteSecondary text-blackPrimary block">
                    {item.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/products/${item.id}`}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item.id)} // Gọi hàm xử lý xóa
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
