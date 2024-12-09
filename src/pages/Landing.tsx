import { Sidebar, Stats, Welcome } from "../components";
import { BarChart, LineGraph, PieChart } from "../components/chart";

const Landing = () => {
  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full pt-6 pl-9 max-sm:pt-6 max-sm:pl-5 flex max-[1700px]:flex-wrap gap-x-10 max-[400px]:pl-2">
        <div>
          <div>
            <Welcome>
              <Welcome.Title>Xin chào,</Welcome.Title>
              <Welcome.Description>
                Đây là tổng quan về cửa hàng của bạn. Dưới đây là các thống kê
                quan trọng để giúp bạn quản lý và phát triển cửa hàng dễ dàng
                hơn.
              </Welcome.Description>
              <Welcome.ActionButton
                onClick={() => console.log("Đang phân tích...")}
              >
                Phân tích số liệu
              </Welcome.ActionButton>
            </Welcome>
            <Stats />
          </div>

          {/* Tổng quan về Lưu lượng truy cập */}
          <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Lưu lượng truy cập (Website)
            </h3>
            <LineGraph />
            <p className="text-sm text-gray-500 mt-2">
              Dữ liệu về số lượt truy cập hàng ngày giúp bạn nắm bắt xu hướng
              người dùng trên website.
            </p>
          </div>

          {/* Tổng quan về Đơn hàng */}
          <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Đơn hàng (Tháng này)
            </h3>
            <BarChart />
            <p className="text-sm text-gray-500 mt-2">
              Theo dõi số lượng đơn hàng và doanh thu của bạn trong tháng này.
            </p>
          </div>

          {/* Tổng quan về Nguồn gốc khách hàng */}
          <div className="sm:w-[50%] mt-10 max-sm:w-[70%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Nguồn gốc khách hàng
            </h3>
            <PieChart />
            <p className="text-sm text-gray-500 mt-2">
              Phân tích các nguồn gốc khách hàng (từ quảng cáo, tìm kiếm, giới
              thiệu, v.v.) để tối ưu chiến lược marketing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
