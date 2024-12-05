import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getImagesByProductId } from "../api/ProductAPI"; // Đảm bảo bạn import đúng API

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

interface ProductTableProps {
  products: Product[];
}

const inStockClass: string =
  "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
const outOfStockClass: string =
  "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";

const ProductTable = ({ products }: ProductTableProps) => {
  const [productImages, setProductImages] = useState<{ [key: number]: string }>(
    {}
  );

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

  return (
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
                  src={productImages[item.id] || "/default-image.jpg"} // Sử dụng ảnh mặc định nếu chưa có ảnh
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
                  className={item.quantity > 0 ? inStockClass : outOfStockClass}
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
                <Link
                  to="#"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlineTrash className="text-lg" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
