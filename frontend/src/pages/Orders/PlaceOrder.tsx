import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cartSlice";
import { RootState } from "../../redux/store";
import { Loader } from "lucide-react";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto px-4 mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-gray-300 shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Image</th>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-left">Quantity</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item: any, index: number) => (
                  <tr key={index} className="border-t hover:bg-gray-50 transition duration-150">
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">
                      <Link
                        to={`/productupdate/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">${item.price.toFixed(2)}</td>
                    <td className="p-2">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Order Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-lg">
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">Items:</span> $
                {cart.itemsPrice}
              </li>
              <li>
                <span className="font-semibold">Shipping:</span> $
                {cart.shippingPrice}
              </li>
              <li>
                <span className="font-semibold">Tax:</span> $
                {cart.taxPrice}
              </li>
              <li>
                <span className="font-semibold">Total:</span> $
                {cart.totalPrice}
              </li>
            </ul>

            <div>
              <h3 className="text-xl font-semibold mb-2">Shipping</h3>
              <p>
                <strong>Address:</strong> {cart?.shippingAddress.address},{" "}
                {cart?.shippingAddress.city} {cart?.shippingAddress.postalCode},{" "}
                {cart?.shippingAddress.country}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
              <p>
                <strong>Method:</strong> {cart?.paymentMethod}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4">
              <Message variant="error">
                {(error as { data?: { message?: string }; error?: string })
                  ?.data?.message || (error as { error?: string })?.error}
              </Message>
            </div>
          )}

          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-lg w-full mt-6 transition-colors"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <Loader className="h-5 w-5 animate-spin text-emerald-800" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
