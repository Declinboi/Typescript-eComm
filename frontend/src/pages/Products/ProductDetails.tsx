import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import { Box, Clock, Loader, ShoppingCart, Star, Store } from "lucide-react";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import { RootState } from "../../redux/store";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cartSlice";
// import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error: any) {
      toast.error(error?.data || error.message || "Something went wrong");
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-black rounded-lg px-4 py-2 shadow-lg bg-green-200 hover:text-gray-700 font-semibold hover:underline ml-[10rem]"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader className="h-8 w-8 animate-spin text-emerald-800" />
      ) : error ? (
        <Message variant="error">
          {(error as { data?: { message?: string }; error?: string })?.data
            ?.message || (error as { error?: string })?.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap bg-gray-100 relative px-4 text-black rounded-lg shadow-lg justify-between mt-8 mx-auto max-w-screen-xl overflow-hidden">
            <div className="w-full xl:w-1/2 p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg object-cover max-h-[500px] sm:max-h-[600px]"
              />
              <HeartIcon product={product} />
            </div>

            <div className="w-full xl:w-1/2 flex flex-col justify-between p-4">
              <h2 className="text-2xl font-semibold break-words">
                {product.name}
              </h2>
              <p className="my-4 text-green-500 break-words">
                {product.description}
              </p>
              <p className="text-4xl sm:text-5xl my-4 font-extrabold">
                ${product.price}
              </p>

              <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-6">
                <div className="space-y-4">
                  <h1 className="flex items-center">
                    <Store className="mr-2 text-green-800" /> Brand:{" "}
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center">
                    <Clock className="mr-2 text-green-800" /> Added:{" "}
                    {moment(product.createdAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center">
                    <Star className="mr-2 text-green-800" /> Reviews:{" "}
                    {product.numReviews}
                  </h1>
                </div>

                <div className="space-y-4 rounded-lg shadow-md p-4 bg-white">
                  <h1 className="flex items-center">
                    <Star className="mr-2 text-green-800" /> Ratings:{" "}
                    {product?.rating}
                  </h1>
                  <h1 className="flex items-center">
                    <ShoppingCart className="mr-2 text-green-800" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center">
                    <Box className="mr-2 text-green-800" /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex items-center flex-wrap justify-start gap-4 mb-4">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      className="p-2 bg-green-300 rounded-full text-black disabled:opacity-50"
                      disabled={qty <= 1}
                    >
                      -
                    </button>

                    <span className="text-lg font-semibold">{qty}</span>

                    <button
                      onClick={() =>
                        setQty((prev) =>
                          Math.min(product.countInStock, prev + 1)
                        )
                      }
                      className="p-2 bg-green-300 rounded-full text-black disabled:opacity-50"
                      disabled={qty >= product.countInStock}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add To Cart
              </button>
            </div>

            <div className="w-full mt-10 bg-green-100 p-6 rounded-lg overflow-x-auto">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
