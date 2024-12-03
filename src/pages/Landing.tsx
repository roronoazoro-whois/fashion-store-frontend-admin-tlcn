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
                Đây là cái nhìn tổng quan đầy đủ về cửa hàng thương mại điện tử
                của bạn. Hãy phân tích các số liệu và đưa ra quyết định thông
                minh.
              </Welcome.Description>
              <Welcome.ActionButton
                onClick={() => console.log("Đang phân tích...")}
              >
                Phân tích số liệu
              </Welcome.ActionButton>
            </Welcome>
            <Stats />
          </div>
          <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Tổng quan về Lưu lượng truy cập
            </h3>
            <LineGraph />
          </div>
          <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Tổng quan về Đơn hàng
            </h3>
            <BarChart />
          </div>
          <div className="sm:w-[50%] mt-10 max-sm:w-[70%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Tổng quan về Nguồn gốc
            </h3>
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Landing;
