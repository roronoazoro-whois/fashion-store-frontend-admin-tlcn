interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // Chỉ tạo danh sách trang nếu có hơn một trang
  if (totalPages <= 1) return null;

  // Tạo danh sách các trang để hiển thị
  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`border border-gray-600 py-1 px-3 hover:border-gray-500 ${
            currentPage === number
              ? "dark:bg-whiteSecondary bg-blackPrimary dark:text-blackPrimary text-whiteSecondary"
              : "dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary"
          }`}
          onClick={() => onPageChange(number)}
        >
          {number + 1}
        </button>
      ))}
      <button
        className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
