const WhiteButton = ({
  onClick, // Thêm onClick để xử lý sự kiện
  type = "button", // Giữ type mặc định là "button"
  text,
  width,
  py,
  textSize,
  children,
}: {
  onClick?: () => void;
  type?: "button" | "submit"; // Chấp nhận các loại button khác nhau
  text: string;
  width: string;
  py: string;
  textSize: string;
  children?: React.ReactNode;
}) => {
  return (
    <button
      type={type} // Nếu là "submit", sẽ tự động submit form
      onClick={onClick} // Xử lý sự kiện khi nhấn
      className={`dark:bg-whiteSecondary bg-blackPrimary w-${width} py-${py} text-${textSize} dark:hover:bg-white hover:bg-gray-800 bg-blackPrimary duration-200 flex items-center justify-center gap-x-2`}
    >
      {children}
      <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
        {text}
      </span>
    </button>
  );
};

export default WhiteButton;
