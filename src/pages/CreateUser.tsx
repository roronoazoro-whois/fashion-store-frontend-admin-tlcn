import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom
import { HiOutlineSave } from "react-icons/hi";
import {
  InputWithLabel,
  Sidebar,
  SimpleInput,
  WhiteButton,
} from "../components";
import SelectInput from "../components/SelectInput";
import { roles } from "../utils/data";

const CreateUser = () => {
  const navigate = useNavigate(); // Khai báo hàm navigate để điều hướng

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm người dùng mới
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton
                onClick={() => navigate("/users")} // Dùng navigate thay vì Link
                textSize="lg"
                width="48"
                py="2"
                text="Lưu lại"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
            </div>
          </div>

          {/* Add User Information section here  */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin người dùng
              </h3>

              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Tên">
                  <SimpleInput type="text" placeholder="Nhập tên..." />
                </InputWithLabel>

                <InputWithLabel label="Họ">
                  <SimpleInput type="text" placeholder="Nhập họ..." />
                </InputWithLabel>

                <InputWithLabel label="Email">
                  <SimpleInput type="email" placeholder="Nhập email ..." />
                </InputWithLabel>

                <InputWithLabel label="Mật khẩu">
                  <SimpleInput type="password" placeholder="Nhập mật khẩu..." />
                </InputWithLabel>

                <InputWithLabel label="Xác nhận mật khẩu">
                  <SimpleInput
                    type="password"
                    placeholder="Nhập xác nhận mật khẩu..."
                  />
                </InputWithLabel>

                <InputWithLabel label="Chọn vai trò">
                  <SelectInput selectList={roles} />
                </InputWithLabel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
