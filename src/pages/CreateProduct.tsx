import { useNavigate } from "react-router-dom";
import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";

// Danh mục, màu sắc và kích thước mẫu
const categories = [
  { id: 1, name: "Áo thun", slug: "ao-thun" },
  { id: 2, name: "Quần áo", slug: "quan-ao" },
  { id: 3, name: "Phụ kiện", slug: "phu-kien" },
  { id: 4, name: "Áo nam", slug: "ao-nam" },
  { id: 5, name: "Áo polo", slug: "ao-polo" },
  { id: 6, name: "Áo sơ mi", slug: "ao-so-mi" },
  { id: 7, name: "Áo dài tay", slug: "ao-dai-tay" },
  { id: 8, name: "Áo khoác", slug: "ao-khoac" },
  { id: 9, name: "Áo Tanktop", slug: "ao-tank-top" },
  { id: 10, name: "Áo thể thao", slug: "ao-the-thao" },
  { id: 11, name: "Quần nam", slug: "quan-nam" },
  { id: 12, name: "Quần shorts", slug: "quan-shorts" },
  { id: 13, name: "Quần jeans", slug: "quan-jeans" },
  { id: 14, name: "Quần dài", slug: "quan-dai" },
  { id: 15, name: "Quần thể thao", slug: "quan-the-thao" },
  { id: 16, name: "Quần lót", slug: "quan-lot" },
  { id: 17, name: "Quần bơi", slug: "quan-boi" },
  { id: 18, name: "Tất/Vớ", slug: "tat-vo" },
  { id: 19, name: "Mũ/Nón", slug: "mu-non" },
  { id: 20, name: "Túi", slug: "tui" },
  {
    id: 21,
    name: "Quần lót Brief (Tam giác)",
    slug: "quan-lot-brief-tam-giac",
  },
  { id: 22, name: "Quần lót Trunk (Boxer)", slug: "quan-lot-trunk-boxer" },
  { id: 23, name: "Boxer Brief (Boxer dài)", slug: "boxer-brief-boxer-dai" },
  { id: 24, name: "Long Leg", slug: "long-leg" },
  { id: 25, name: "Boxer Shorts", slug: "boxer-shorts" },
  { id: 26, name: "Thể thao", slug: "the-thao" },
  { id: 27, name: "Quần Joggers", slug: "quan-joggers" },
  { id: 28, name: "Mặc hàng ngày", slug: "mac-hang-ngay" },
];

const colors = [
  { id: 1, code: "#3498db", name: "Xanh" },
  { id: 2, code: "#000000", name: "Đen" },
  { id: 3, code: "#7f8c8d", name: "Xám" },
  { id: 4, code: "#ffffff", name: "Trắng" },
  { id: 5, code: "#e74c3c", name: "Đỏ" },
  { id: 6, code: "#2c3e50", name: "Xanh navy" },
  { id: 7, code: "#2e8b57", name: "Xanh rêu" },
  { id: 8, code: "#f5f5dc", name: "Kem" },
];

const sizes = [
  { id: 1, name: "S" },
  { id: 2, name: "M" },
  { id: 3, name: "L" },
  { id: 4, name: "39-42" },
  { id: 5, name: "43-46" },
];

const CreateProduct = () => {
  const navigate = useNavigate(); // Dùng navigate để điều hướng sau khi lưu sản phẩm

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
              Thêm sản phẩm mới
            </h2>
            <button
              onClick={() => navigate("/products")} // Dẫn đến danh sách sản phẩm
              className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
            >
              <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                Lưu lại
              </span>
            </button>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Left Div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin cơ bản
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên sản phẩm">
                  <SimpleInput type="text" placeholder="Nhập tên sản phẩm..." />
                </InputWithLabel>

                <InputWithLabel label="Mô tả sản phẩm">
                  <TextAreaInput
                    placeholder="Nhập mô tả sản phẩm..."
                    rows={4}
                  />
                </InputWithLabel>

                <InputWithLabel label="Giá gốc">
                  <SimpleInput type="number" placeholder="Nhập giá gốc..." />
                </InputWithLabel>

                <InputWithLabel label="Giá khuyến mãi">
                  <SimpleInput
                    type="number"
                    placeholder="Nhập giá khuyến mãi..."
                  />
                </InputWithLabel>
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Sản phẩm thuộc danh mục:
              </h3>
              <div className="grid grid-cols-1 gap-y-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="categories"
                      value={category.id}
                      className="form-checkbox"
                    />
                    {category.name}
                  </label>
                ))}
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Sản phẩm có màu:
              </h3>
              <div className="grid grid-cols-1 gap-y-3">
                {colors.map((color) => (
                  <label key={color.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="colors"
                      value={color.id}
                      className="form-checkbox"
                    />
                    <span>{color.name}</span>
                  </label>
                ))}
              </div>

              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                Sản phẩm có kích thước:
              </h3>
              <div className="grid grid-cols-1 gap-y-3">
                {sizes.map((size) => (
                  <label key={size.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size.id}
                      className="form-checkbox"
                    />
                    {size.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Right Div - Product Images */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Hình ảnh sản phẩm
              </h3>
              <ImageUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
