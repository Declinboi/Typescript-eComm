import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";
import { addToCart, removeFromCart } from "../redux/features/cartSlice";
import { RootState } from "../redux/store";
import { Product } from "./Admin/AllProducts";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product: Product, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id: Product) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty <Link to="/shop">Go To Shop</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full md:w-[80%] mx-auto px-4">
              <h1 className="text-2xl text-green-800 font-semibold my-4">
                Shopping Cart
              </h1>

              {cartItems.map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-center mb-6 bg-white rounded-lg shadow-md p-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 ml-4">
                    <Link
                      to={`/product-details/${item._id}`}
                      className="text-green-600 hover:underline text-lg font-semibold"
                    >
                      {item.name}
                    </Link>
                    <div className="text-sm text-green-500 mt-1">
                      {item.brand}
                    </div>
                    <div className="mt-2 font-bold text-green-800">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="w-28 flex items-center justify-center space-x-2">
                    <button
                      onClick={() =>
                        addToCartHandler(item, Math.max(1, item.qty - 1))
                      }
                      className="bg-green-200 px-3 py-1 rounded-lg text-black font-semibold"
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{item.qty}</span>
                    <button
                      onClick={() =>
                        addToCartHandler(
                          item,
                          Math.min(item.countInStock, item.qty + 1)
                        )
                      }
                      className="bg-green-200 px-3 py-1 rounded-lg text-black font-semibold"
                      disabled={item.qty >= item.countInStock}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="text-red-500 ml-6"
                    onClick={() => removeFromCartHandler(item._id)}
                    aria-label="Remove item"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {/* Cart Summary */}
              <div className="mt-8 max-w-md w-full self-end bg-green-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">
                  Items (
                  {cartItems.reduce(
                    (acc: number, item: any) => acc + item.qty,
                    0
                  )}
                  )
                </h2>
                <div className="text-2xl font-bold text-green-900">
                  $
                  {cartItems
                    .reduce(
                      (acc: number, item: any) => acc + item.qty * item.price,
                      0
                    )
                    .toFixed(2)}
                </div>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white mt-4 py-2 px-4 rounded-full text-lg w-full transition-colors"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
