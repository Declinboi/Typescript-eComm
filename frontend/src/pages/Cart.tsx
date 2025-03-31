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
            <div className="flex flex-col w-[80%]">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item: any) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product-details/${item._id}`} className="text-pink-500">
                      {item.name}
                    </Link>

                    <div className="mt-2 text-white">{item.brand}</div>
                    <div className="mt-2 text-white font-bold">
                      $ {item.price}
                    </div>
                  </div>

                  <div className="w-24">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          addToCartHandler(item, Math.max(1, item.qty - 1))
                        }
                        className="p-2 bg-gray-300 rounded-full text-black"
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
                        className="p-2 bg-gray-300 rounded-full text-black"
                        disabled={item.qty >= item.countInStock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <Trash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items (
                    {cartItems.reduce(
                      (acc: any, item: any) => acc + item.qty,
                      0
                    )}
                    )
                  </h2>

                  <div className="text-2xl font-bold">
                    ${" "}
                    {cartItems
                      .reduce(
                        (acc: any, item: any) => acc + item.qty * item.price,
                        0
                      )
                      .toFixed(2)}
                  </div>

                  <button
                    className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
