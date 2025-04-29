import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/userApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import { Loader } from "lucide-react";
import { ApexOptions } from "apexcharts";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery({});
  const { data: customers, isLoading: _loading } = useGetUsersQuery();
  const { data: orders, isLoading: _loadingTwo } = useGetTotalOrdersQuery({});
  const { data: salesDetail } = useGetTotalSalesByDateQuery({});

  const [state, setState] = useState<{
    options: ApexOptions;
    series: ApexAxisChartSeries;
  }>({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item: any) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState: any) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item: any) => item.x),
          },
        },

        series: [
          {
            name: "Sales",
            data: formattedSalesDate.map((item: any) => item.y),
          },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-black p-5 text-white shadow-lg w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] text-white bg-green-500 text-center p-3">
              $
            </div>

            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              ${" "}
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin text-emerald-800" />
              ) : (
                sales?.totalSales.toFixed(2)
              )}
            </h1>
          </div>
          <div className="rounded-lg bg-black shadow-lg p-5 w-[20rem] text-white mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-green-500 text-center p-3">
              $
            </div>

            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin text-emerald-800" />
              ) : (
                customers?.length
              )}
            </h1>
          </div>
          <div className="rounded-lg bg-black text-white shadow-lg p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-green-500 text-center p-3">
              $
            </div>

            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin text-emerald-800" />
              ) : (
                orders?.totalOrders
              )}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem] shadow-lg">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        <div className="mt-[4rem] shadow-lg">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
