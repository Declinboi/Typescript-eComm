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
        <div className="w-full overflow-x-auto px-4">
          <div className="flex justify-end min-w-[800px]">
            <table className="w-full max-w-6xl border-2 border-gray-300 shadow-lg">
              <thead className="w-full border-2 border-gray-300">
                <tr className="text-green-500 [&>th]:text-left [&>th]:pl-1">
                  <th>ITEMS</th>
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
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
                    <td>{order.createdAt?.substring(0, 10) || "N/A"}</td>
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
                        <button className="text-blue-500 hover:underline">
                          More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
