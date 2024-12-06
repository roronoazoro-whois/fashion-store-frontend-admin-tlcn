import { HiOutlineSave } from "react-icons/hi";
import {
  InputWithLabel,
  Sidebar,
  SimpleInput,
  WhiteButton,
} from "../components";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
  getUserInfo,
  getUserAvatarAndFullName,
  updateUserInfo,
  updateAvatar, // Import the new updateAvatar function
} from "../api/UserAPI";
import { getUserFromLocalStorage } from "../utils/authUtils";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import axios from "axios";

// Validation schema for the form
const schema = yup
  .object({
    fullName: yup.string().required("Họ và tên không thể để trống"),
    phoneNumber: yup
      .string()
      .matches(/^\d+$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không thể để trống"),
    gender: yup.string().required("Giới tính không thể để trống"),
    dateOfBirth: yup.string().required("Ngày sinh không thể để trống"),
  })
  .required();

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: "Full Name hiện ở đây",
    avatar: "/src/assets/profile.jpg",
    phoneNumber: "",
    roleName: "User",
    gender: "",
    dateOfBirth: "",
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(true);

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const token = getUserFromLocalStorage()?.token;
      if (!token) throw new Error("Token không hợp lệ");

      const userData = await getUserInfo(token);
      const userAvatarAndName = await getUserAvatarAndFullName(token);

      setUserInfo({
        fullName: userAvatarAndName.fullName || "Full Name hiện ở đây",
        avatar: userAvatarAndName.avatar || "/src/assets/profile.jpg",
        phoneNumber: userData.phoneNumber || "",
        roleName: getUserFromLocalStorage()?.role || "User",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth || "",
      });

      // Set form values to the fetched data
      setValue("fullName", userAvatarAndName.fullName);
      setValue("phoneNumber", userData.phoneNumber);
      setValue("gender", userData.gender);
      setValue("dateOfBirth", userData.dateOfBirth);
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const onSubmit = async (data: {
    fullName: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
  }) => {
    try {
      const token = getUserFromLocalStorage()?.token;
      if (!token) throw new Error("Token không hợp lệ");

      const response = await updateUserInfo(token, data);
      if (response.success) {
        toast.success("Thông tin của bạn đã được cập nhật thành công!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng", error);
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
    }
  };

  // Handle avatar upload and update
  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");
      try {
        // Upload the file to Cloudinary
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/doo4qviqi/image/upload`,
          formData
        );
        const avatarUrl = response.data.secure_url;

        // Update avatar on the server
        const token = getUserFromLocalStorage()?.token;
        if (!token) throw new Error("Token không hợp lệ");

        await updateAvatar(token, avatarUrl);

        // Update local user info with the new avatar URL
        setUserInfo((prev) => ({
          ...prev,
          avatar: avatarUrl,
        }));

        toast.success("Avatar đã được cập nhật!");
      } catch (error) {
        console.error("Lỗi khi tải lên avatar", error);
        toast.error("Cập nhật avatar thất bại. Vui lòng thử lại!");
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin của bạn
              </h2>
            </div>
            <WhiteButton
              textSize="lg"
              width="48"
              py="2"
              text="Cập nhật"
              onClick={handleSubmit(onSubmit)}
            >
              <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
            </WhiteButton>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            {/* Profile details section */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={userInfo.avatar}
                      alt="Profile"
                      className="rounded-full w-20 h-20 cursor-pointer"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    />
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-xl">
                      {userInfo.fullName}
                    </p>
                    <p className="dark:text-whiteSecondary text-blackPrimary">
                      {userInfo.roleName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Input fields for editing user info */}
              <div className="flex flex-col gap-3 mt-5">
                <InputWithLabel label="Họ và tên">
                  <Controller
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                      <SimpleInput
                        type="text"
                        placeholder="Nhập họ và tên"
                        {...field}
                      />
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </InputWithLabel>

                <InputWithLabel label="Số điện thoại">
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <SimpleInput
                        type="text"
                        placeholder="Nhập số điện thoại"
                        {...field}
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </InputWithLabel>

                <InputWithLabel label="Giới tính">
                  <div className="flex gap-4">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        onChange={(e) => {
                          setValue("gender", e.target.value);
                          setUserInfo((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }));
                        }}
                        checked={userInfo.gender === "Nam"}
                      />
                      Nam
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        onChange={(e) => {
                          setValue("gender", e.target.value);
                          setUserInfo((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }));
                        }}
                        checked={userInfo.gender === "Nữ"}
                      />
                      Nữ
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Khác"
                        onChange={(e) => {
                          setValue("gender", e.target.value);
                          setUserInfo((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }));
                        }}
                        checked={userInfo.gender === "Khác"}
                      />
                      Khác
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </InputWithLabel>

                <InputWithLabel label="Ngày sinh">
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <SimpleInput
                        type="date"
                        placeholder="Chọn ngày sinh"
                        {...field}
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </InputWithLabel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
