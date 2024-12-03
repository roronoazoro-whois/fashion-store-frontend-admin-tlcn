// import { useEffect, useState } from "react";
// import axios from "axios";

// // Định nghĩa kiểu dữ liệu cho một sản phẩm
// interface Product {
//   id: string;
//   name: string;
//   brand: string;
//   colors: string[]; // Mảng các màu sắc của sản phẩm
//   categories: string[]; // Mảng các danh mục của sản phẩm
//   price: number;
//   salePrice: number;
//   quantity: number;
//   images: string[]; // Mảng URL hình ảnh của sản phẩm
// }

// const ProductTable = () => {
//   const [products, setProducts] = useState<Product[]>([]); // Sử dụng kiểu Product
//   const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading
//   const [error, setError] = useState<string>(""); // Thông báo lỗi nếu có

//   useEffect(() => {
//     // Fetch data từ API
//     const fetchProducts = async () => {
//       setLoading(true); // Bắt đầu loading
//       setError(""); // Reset lỗi
  
//       try {
//         const response = await axios.get("/api/products"); // Thay bằng endpoint chính xác
  
//         console.log(response.data); // Log dữ liệu trả về từ API để kiểm tra
  
//         // Kiểm tra nếu dữ liệu trả về là một mảng
//         if (Array.isArray(response.data)) {
//           setProducts(response.data); // Gán mảng nếu dữ liệu hợp lệ
//         } else if (response.data && response.data.id) {
//           // Nếu dữ liệu trả về là một đối tượng sản phẩm, chuyển nó thành mảng
//           setProducts([response.data]); 
//         } else {
//           console.error("Dữ liệu không phải mảng hoặc đối tượng sản phẩm:", response.data);
//           setError("Dữ liệu không hợp lệ");
//           setProducts([]); // Nếu không phải mảng hoặc đối tượng hợp lệ, gán mảng rỗng
//         }
//       } catch (error) {
//         console.error("Không thể lấy sản phẩm:", error);
//         setError("Không thể lấy sản phẩm, vui lòng thử lại");
//         setProducts([]); // Nếu có lỗi, gán mảng rỗng
//       } finally {
//         setLoading(false); // Kết thúc loading
//       }
//     };
  
//     fetchProducts();
//   }, []); // Chỉ chạy một lần khi component mount
  

//   return (
//     <div>
//       {loading && <p>Loading...</p>} {/* Hiển thị loading khi đang tải dữ liệu */}
//       {error && <p className="text-red-500">{error}</p>} {/* Hiển thị lỗi nếu có */}

//       <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
//         <colgroup>
//           <col className="w-3/12" />
//           <col className="w-2/12" />
//           <col className="w-2/12" />
//           <col className="w-2/12" />
//           <col className="w-1/12" />
//           <col className="w-1/12" />
//           <col className="w-1/12" />
//         </colgroup>
//         <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
//           <tr>
//             <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
//               Product
//             </th>
//             <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
//               Brand
//             </th>
//             <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
//               Color
//             </th>
//             <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
//               Category
//             </th>
//             <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
//               Price
//             </th>
//             <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
//               Sale Price
//             </th>
//             <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
//               Quantity
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-white/5">
//           {products.length === 0 ? (
//             <tr>
//               <td colSpan={7} className="text-center py-4">
//                 No products available
//               </td>
//             </tr>
//           ) : (
//             products.map((product) => (
//               <tr key={product.id}>
//                 <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
//                   <div className="flex items-center gap-x-4">
//                     <img
//                       src={product.images?.[0] || "/default-image.png"}
//                       alt={product.name}
//                       className="h-8 w-8 rounded-full bg-gray-800"
//                     />
//                     <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
//                       {product.name}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="py-4">{product.brand}</td>
//                 <td className="py-4">
//                   {product.colors?.join(", ")}
//                 </td>
//                 <td className="py-4">
//                   {product.categories?.join(", ")}
//                 </td>
//                 <td className="py-4">{product.price}</td>
//                 <td className="py-4">{product.salePrice}</td>
//                 <td className="py-4">{product.quantity}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductTable;








import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineEye } from "react-icons/hi";
import { productAdminItems } from "../utils/data";

const inStockClass: string =
  "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
const outOfStockClass: string =
  "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";



const ProductTable = () => {
  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
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
            Product
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            SKU
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Status
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20"
          >
            Price
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {productAdminItems.map((item) => (
          <tr key={nanoid()}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <img
                  src={item.product.imageUrl}
                  alt=""
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.product.name}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 table-cell pr-8">
              <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.sku}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="flex items-center gap-x-2 justify-start">
                <div
                  className={
                    item.status === "In stock" ? inStockClass : outOfStockClass
                  }
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="dark:text-whiteSecondary text-blackPrimary block">
                  {item.status}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium table-cell lg:pr-20">
              {item.price}
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to="/products/1"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link
                  to="/products/1"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                >
                  <HiOutlineEye className="text-lg" />
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
