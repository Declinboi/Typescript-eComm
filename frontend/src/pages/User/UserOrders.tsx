import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { Loader } from "lucide-react";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery({});

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl text-center font-semibold mb-4">
        My Orders
      </h2>

      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin text-emerald-800" />
      ) : error ? (
        <Message variant="error">
          {(error as { data?: { message?: string }; error?: string })?.data
            ?.message || (error as { error?: string })?.error}
        </Message>
      ) : (
        <div className="min-w-[700px]">
          <table className="w-full border-2 border-gray-300 shadow-lg ">
            <thead className="bg-gray-100">
              <tr className="text-left text-xs sm:text-sm text-gray-600">
                <th className="py-2 px-2">IMAGE</th>
                <th className="py-2 px-2">ID</th>
                <th className="py-2 px-2">DATE</th>
                <th className="py-2 px-2">TOTAL</th>
                <th className="py-2 px-2">PAID</th>
                <th className="py-2 px-2">DELIVERED</th>
                <th className="py-2 px-2">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order: any) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-2 px-2">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-[4rem] sm:w-[6rem] rounded-lg"
                    />
                  </td>

                  <td className="py-2 px-2">{order._id}</td>
                  <td className="py-2 px-2">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="py-2 px-2">$ {order.totalPrice}</td>

                  <td className="py-2 px-2">
                    <span
                      className={`block text-center rounded-full px-2 py-1 w-[5.5rem] sm:w-[6rem] ${
                        order.isPaid ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {order.isPaid ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="py-2 px-2">
                    <span
                      className={`block text-center rounded-full px-2 py-1 w-[5.5rem] sm:w-[6rem] ${
                        order.isDelivered ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {order.isDelivered ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="py-2 px-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-green-400 text-black text-xs sm:text-sm py-1 px-3 rounded-lg shadow-lg">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
