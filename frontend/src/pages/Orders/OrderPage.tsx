import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { RootState } from "../../redux/store";
import { Loader } from "lucide-react";

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypalData,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery({});

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypalData.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions" as any,
          value: {
            clientId: paypalData.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus" as any,
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypalData, paypalDispatch]);

  function onApprove(actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error: any) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(actions: any) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID: any) => {
        return orderID;
      });
  }

  function onError(err: any) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Order marked as delivered");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to mark as delivered");
    }
  };

  if (isLoading || loadingPaPal || !paypalData?.clientId) {
    return <Loader className="h-4 w-4 animate-spin text-emerald-800" />;
  }

  if (error) {
    return (
      <Message variant="error">
        {(error as { data?: { message?: string }; error?: string })?.data
          ?.message || (error as { error?: string })?.error}
      </Message>
    );
  }

  if (!order) return null;

  return (
    // <div className="container flex flex-col ml-[10rem] md:flex-row">
    //   <div className="md:w-2/3 pr-4">
    //     <div className="border gray-300 mt-5 pb-4 mb-5">
    //       {order.orderItems.length === 0 ? (
    //         <Message>Order is empty</Message>
    //       ) : (
    //         <div className="overflow-x-auto">
    //           <table className="w-[80%]">
    //             <thead className="border-b-2">
    //               <tr>
    //                 <th className="p-2">Image</th>
    //                 <th className="p-2">Product</th>
    //                 <th className="p-2 text-center">Quantity</th>
    //                 <th className="p-2">Unit Price</th>
    //                 <th className="p-2">Total</th>
    //               </tr>
    //             </thead>

    //             <tbody>
    //               {order.orderItems.map((item: any, index: any) => (
    //                 <tr key={index}>
    //                   <td className="p-2">
    //                     <img
    //                       src={item.image}
    //                       alt={item.name}
    //                       className="w-16 h-16 object-cover"
    //                     />
    //                   </td>

    //                   <td className="p-2">
    //                     <Link to={`/product-details/${item.product}`}>
    //                       {item.name}
    //                     </Link>
    //                   </td>

    //                   <td className="p-2 text-center">{item.qty}</td>
    //                   <td className="p-2 text-center">{item.price}</td>
    //                   <td className="p-2 text-center">
    //                     $ {(item.qty * item.price).toFixed(2)}
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       )}
    //     </div>
    //   </div>

    //   <div className="md:w-1/3">
    //     <div className="mt-5 p-2 rounded-lg border-dotted border-2 border-green-300 pb-4 mb-4">
    //       <h2 className="text-xl font-bold mb-2">Shipping</h2>
    //       <p className="mb-4 mt-4">
    //         <strong className="text-green-500">Order:</strong> {order._id}
    //       </p>

    //       <p className="mb-4">
    //         <strong className="text-green-500">Name:</strong>{" "}
    //         {order.user.username}
    //       </p>

    //       <p className="mb-4">
    //         <strong className="text-green-500">Email:</strong>{" "}
    //         {order.user.email}
    //       </p>

    //       <p className="mb-4">
    //         <strong className="text-green-500">Address:</strong>{" "}
    //         {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
    //         {order.shippingAddress.postalCode}, {order.shippingAddress.country}
    //       </p>

    //       <p className="mb-4">
    //         <strong className="text-green-500">Method:</strong>{" "}
    //         {order.paymentMethod}
    //       </p>

    //       {order.isPaid ? (
    //         <Message variant="success">Paid on {order.paidAt}</Message>
    //       ) : (
    //         <Message variant="error">Not paid</Message>
    //       )}
    //     </div>

    //     <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
    //     <div className="flex justify-between mb-2  ">
    //       <span>Items</span>
    //       <span>$ {order.itemsPrice}</span>
    //     </div>
    //     <div className="flex justify-between mb-2">
    //       <span>Shipping</span>
    //       <span>$ {order.shippingPrice}</span>
    //     </div>
    //     <div className="flex justify-between mb-2">
    //       <span>Tax</span>
    //       <span>$ {order.taxPrice}</span>
    //     </div>
    //     <div className="flex justify-between mb-2">
    //       <span>Total</span>
    //       <span>$ {order.totalPrice}</span>
    //     </div>

    //     {!order.isPaid && (
    //       <div>
    //         {loadingPay && (
    //           <Loader className="h-4 w-4 animate-spin text-emerald-800" />
    //         )}{" "}
    //         {isPending ? (
    //           <Loader className="h-4 w-4 animate-spin text-gray-800" />
    //         ) : (
    //           <div>
    //             <div>
    //               <PayPalButtons
    //                 key={orderId}
    //                 createOrder={createOrder}
    //                 onApprove={onApprove}
    //                 onError={onError}
    //               ></PayPalButtons>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     )}

    //     {loadingDeliver && (
    //       <Loader className="h-4 w-4 animate-spin text-emerald-800" />
    //     )}
    //     {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
    //       <div>
    //         <button
    //           type="button"
    //           className="bg-green-500 text-white w-full py-2"
    //           onClick={deliverHandler}
    //         >
    //           Mark As Delivered
    //         </button>
    //       </div>
    //     )}
    //   </div>
    // </div>

    <div className="container flex flex-col md:flex-row px-4">
  <div className="md:w-2/3 md:pr-4">
    <div className="border border-gray-300 mt-5 pb-4 mb-5">
      {order.orderItems.length === 0 ? (
        <Message>Order is empty</Message>
      ) : (
        // Wrapper for horizontal scroll
        <div className="w-full overflow-x-auto">
          <div className="flex justify-end min-w-[800px]">
            <table className="w-full max-w-5xl">
              <thead className="border-b-2">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Product</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2">Unit Price</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>

              <tbody>
                {order.orderItems.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-2">
                      <Link to={`/product-details/${item.product}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-center">{item.price}</td>
                    <td className="p-2 text-center">
                      $ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>

  <div className="md:w-1/3">
    <div className="mt-5 p-2 rounded-lg border-dotted border-2 border-green-300 pb-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Shipping</h2>
      <p className="mb-4 mt-4">
        <strong className="text-green-500">Order:</strong> {order._id}
      </p>
      <p className="mb-4">
        <strong className="text-green-500">Name:</strong> {order.user.username}
      </p>
      <p className="mb-4">
        <strong className="text-green-500">Email:</strong> {order.user.email}
      </p>
      <p className="mb-4">
        <strong className="text-green-500">Address:</strong>{" "}
        {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
      </p>
      <p className="mb-4">
        <strong className="text-green-500">Method:</strong>{" "}
        {order.paymentMethod}
      </p>

      {order.isPaid ? (
        <Message variant="success">Paid on {order.paidAt}</Message>
      ) : (
        <Message variant="error">Not paid</Message>
      )}
    </div>

    <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
    <div className="flex justify-between mb-2">
      <span>Items</span>
      <span>$ {order.itemsPrice}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Shipping</span>
      <span>$ {order.shippingPrice}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Tax</span>
      <span>$ {order.taxPrice}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Total</span>
      <span>$ {order.totalPrice}</span>
    </div>

    {!order.isPaid && (
      <div>
        {loadingPay && (
          <Loader className="h-4 w-4 animate-spin text-emerald-800" />
        )}
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin text-gray-800" />
        ) : (
          <div>
            <PayPalButtons
              key={orderId}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />
          </div>
        )}
      </div>
    )}

    {loadingDeliver && (
      <Loader className="h-4 w-4 animate-spin text-emerald-800" />
    )}
    {userInfo &&
      userInfo.isAdmin &&
      order.isPaid &&
      !order.isDelivered && (
        <div>
          <button
            type="button"
            className="bg-green-500 text-white w-full py-2"
            onClick={deliverHandler}
          >
            Mark As Delivered
          </button>
        </div>
      )}
  </div>
</div>

  );
};

export default OrderPage;
