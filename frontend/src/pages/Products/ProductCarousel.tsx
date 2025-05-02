import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { Box, Clock, ShoppingCart, Star, Store } from "lucide-react";
import { Product } from "../Admin/AllProducts";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  console.log(products);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4">
      {isLoading ? null : error ? (
        <Message variant="error">
          {(error as { data?: { message?: string }; error?: string })?.data
            ?.message || (error as { error?: string })?.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full max-w-[90%] mx-auto sm:max-w-sm md:max-w-md lg:max-w-[35rem] xl:max-w-[40rem] rounded-lg shadow-lg bg-gray-100"
        >
          {products?.map((products: Product) => (
            <div key={products._id} className="p-4">
              <img
                src={products?.image}
                alt={products.name}
                className="w-full rounded-lg object-cover h-[20rem] sm:h-[25rem] md:h-[30rem]"
              />

              <div className="mt-4 flex flex-col md:flex-row md:justify-between gap-4">
                {/* Left side: name, price, desc */}
                <div className="md:ml-4 flex-1">
                  <h2 className="font-bold text-base sm:text-lg">
                    {products.name}
                  </h2>
                  <p className="mt-1 text-green-500 text-sm sm:text-base">
                    $ {products.price}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 max-w-full">
                    {products?.description.substring(0, 160)}...
                  </p>
                </div>

                {/* Right side: brand, ratings, etc. */}
                <div className="flex flex-col sm:flex-row justify-between text-sm md:gap-6">
                  <div className="mt-4 md:mt-0 w-full">
                    <h1 className="flex items-center mb-2">
                      <Store className="mr-2 text-green-400" /> Brand:{" "}
                      {products?.brand}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <Clock className="mr-2 text-green-400" /> Added:{" "}
                      {moment(products?.createdAt).fromNow()}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <Star className="mr-2 text-green-400" /> Reviews:{" "}
                      {products?.numReviews}
                    </h1>
                  </div>

                  <div className="mt-4 md:mt-0 w-full">
                    <h1 className="flex items-center mb-2">
                      <Star className="mr-2 text-green-400" /> Ratings:{" "}
                      {Math.round(products?.rating)}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <ShoppingCart className="mr-2 text-green-400" /> Quantity:{" "}
                      {products.quantity}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <Box className="mr-2 text-green-400" /> In Stock:{" "}
                      {products.countInStock}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
