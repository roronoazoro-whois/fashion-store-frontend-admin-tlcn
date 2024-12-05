import { useState } from "react";

const ImageUpload = ({
  onImagesSelected,
}: {
  onImagesSelected: (urls: File[]) => void;
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Kiểm tra nếu không có ảnh nào được chọn
    if (selectedFiles.length === 0) {
      setError("Không có ảnh nào được chọn.");
      return;
    }

    // Kiểm tra nếu số lượng ảnh vượt quá 6
    if (selectedFiles.length + images.length > 6) {
      setError("Bạn chỉ được chọn tối đa 6 ảnh.");
      return;
    }

    // Kiểm tra định dạng ảnh
    const validFormats = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "image/webp",
    ];
    const invalidFiles = selectedFiles.filter(
      (file) => !validFormats.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setError(
        "Chỉ cho phép tải lên các file ảnh có định dạng JPG, PNG, GIF, SVG."
      );
      return;
    }

    // Kiểm tra kích thước ảnh (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError("Kích thước mỗi ảnh không được quá 2MB.");
      return;
    }

    // Cập nhật danh sách ảnh
    setImages((prevImages) => {
      const newImages = [...prevImages, ...selectedFiles];
      // Gọi hàm onImagesSelected với file thực tế
      onImagesSelected(newImages);
      return newImages;
    });
    setError(""); // Reset lỗi khi mọi thứ ổn
  };

  // Hàm xử lý khi người dùng xóa ảnh
  const handleImageRemove = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      // Cập nhật lại danh sách ảnh khi xóa
      onImagesSelected(updatedImages);
      return updatedImages;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-5">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer dark:bg-blackPrimary bg-whiteSecondary dark:hover:border-gray-600 hover:border-gray-500"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-blackPrimary dark:text-whiteSecondary"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-blackPrimary dark:text-whiteSecondary">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs dark:text-whiteSecondary text-blackPrimary">
            JPG, PNG, GIF, SVG (MAX. 2MB)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/gif,image/svg+xml"
          multiple
          onChange={handleImageChange}
        />
      </label>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`upload-preview-${index}`}
              className="w-32 h-32 object-cover rounded-md"
            />
            <button
              onClick={() => handleImageRemove(index)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Đã chọn {images.length} / 6 ảnh</p>
      </div>
    </div>
  );
};

export default ImageUpload;
