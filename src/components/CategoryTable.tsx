import React from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryTableProps {
  categories: Category[];
  onDeleteCategory: (id: number) => void; // Hàm xóa danh mục từ trang cha
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onDeleteCategory,
}) => {
  return (
    <div>
      <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
        <colgroup>
          <col className="w-1/12" /> {/* Cột số thứ tự */}
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
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
              Tên danh mục
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Slug
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
          {categories.map((category, index) => (
            <tr key={category.id}>
              {/* Cột số thứ tự */}
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {index + 1}
                </div>
              </td>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {category.name}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 table-cell pr-8">
                <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {category.slug}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/categories/${category.id}`}
                    className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <button
                    onClick={() => onDeleteCategory(category.id)} // Gọi hàm xóa khi bấm vào thùng rác
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
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

export default CategoryTable;
