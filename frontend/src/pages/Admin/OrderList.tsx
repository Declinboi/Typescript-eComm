import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { Loader } from "lucide-react";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery({});

  return (
    <>
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin text-emerald-800" />
      ) : error ? (
        <Message variant="error">
          {(error as { data?: { message?: string }; error?: string })?.data
            ?.message || (error as { error?: string })?.error}
        </Message>
      ) : (
        <div className="">
          <table className=" container mr-4 w-full px-6 border-2 border-gray-300 shadow-lg  ">
            <thead className="w-full rounded-md border-2 border-gray-300">
              <tr className="mb-[5rem] text-green-500">
                <th className="text-left pl-1">ITEMS</th>
                <th className="text-left pl-1">ID</th>
                <th className="text-left pl-1">USER</th>
                <th className="text-left pl-1">DATE</th>
                <th className="text-left pl-1">TOTAL</th>
                <th className="text-left pl-1">PAID</th>
                <th className="text-left pl-1">DELIVERED</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {orders.map((order: any) => (
                <tr key={order._id}>
                  <td>
                    <img
                      src={order?.orderItems[0].image}
                      alt={order?._id}
                      className="w-[5rem] pt-4 rounded-md"
                    />
                  </td>
                  <td>{order?._id}</td>

                  <td>{order.user ? order.user.username : "N/A"}</td>

                  <td>
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>

                  <td>$ {order.totalPrice}</td>

                  <td className="py-2">
                    {order.isPaid ? (
                      <p className="p-1 text-center text-sm bg-green-400 w-[6rem] rounded-full">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center text-sm bg-red-400 w-[6rem] rounded-full">
                        Pending
                      </p>
                    )}
                  </td>

                  <td className="px-2 py-2">
                    {order.isDelivered ? (
                      <p className="p-1 text-center text-sm bg-green-400 w-[6rem] rounded-full">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center text-sm bg-red-400 w-[6rem] rounded-full">
                        Pending
                      </p>
                    )}
                  </td>

                  <td>
                    <Link to={`/order/${order._id}`}>
                      <button>More</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderList;
