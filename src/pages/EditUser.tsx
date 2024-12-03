import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom
import { HiOutlineSave } from "react-icons/hi";
import {
  ImageUpload,
  InputWithLabel,
  Sidebar,
  SimpleInput,
  WhiteButton,
} from "../components";
import SelectInput from "../components/SelectInput";
import { roles } from "../utils/data";
import { useEffect, useState } from "react";

const EditUser = () => {
  const [inputObject, setInputObject] = useState({
    name: "Brent",
    lastname: "Fesi",
    email: "brentfesi@email.com",
    password: "brentfesi123",
    confirmPassword: "brentfesi123",
    role: roles[0].value,
  });

  const navigate = useNavigate(); // Khai báo hàm navigate để điều hướng

  useEffect(() => {
    console.log(inputObject);
  }, [inputObject]);

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Chỉnh sửa người dùng
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton
                onClick={() => navigate("/users")} // Dùng navigate thay vì Link
                textSize="lg"
                width="48"
                py="2"
                text="Cập nhật"
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
                  <SimpleInput
                    type="text"
                    placeholder="Nhập tên..."
                    value={inputObject.name}
                    onChange={(e) =>
                      setInputObject({ ...inputObject, name: e.target.value })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Họ">
                  <SimpleInput
                    type="text"
                    placeholder="Nhập họ..."
                    value={inputObject.lastname}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        lastname: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Email">
                  <SimpleInput
                    type="email"
                    placeholder="Nhập email ..."
                    value={inputObject.email}
                    onChange={(e) =>
                      setInputObject({ ...inputObject, email: e.target.value })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Mật khẩu">
                  <SimpleInput
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    value={inputObject.password}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        password: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Xác nhận mật khẩu">
                  <SimpleInput
                    type="password"
                    placeholder="Nhập xác nhận mật khẩu..."
                    value={inputObject.confirmPassword}
                    onChange={(e) =>
                      setInputObject({
                        ...inputObject,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </InputWithLabel>

                <InputWithLabel label="Chọn vai trò">
                  <SelectInput
                    selectList={roles}
                    value={inputObject.role}
                    onChange={(e) =>
                      setInputObject({ ...inputObject, role: e.target.value })
                    }
                  />
                </InputWithLabel>
              </div>
            </div>

            {/* right div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tải ảnh người dùng
              </h3>
              <ImageUpload />

              <div className="flex justify-center gap-x-2 mt-5 flex-wrap">
                <img
                  src="/src/assets/random user 1.jpg"
                  alt=""
                  className="w-36 h-32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
