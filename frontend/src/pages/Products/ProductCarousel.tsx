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
          className="w-full max-w-5xl mx-auto rounded-lg shadow-lg bg-gray-100 px-2"
        >
          {products?.map((product: Product) => (
            <div key={product._id} className="p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 md:h-[25rem] lg:h-[28rem] xl:h-[30rem] rounded-lg object-cover"
              />

              <div className="mt-4 flex flex-col lg:flex-row justify-between gap-4">
                {/* Product Info */}
                <div className="flex-1">
                  <h2 className="font-bold text-lg">{product.name}</h2>
                  <p className="mt-2 text-green-500 text-base">
                    ${product.price}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 max-w-md">
                    {product.description.substring(0, 160)}...
                  </p>
                </div>

                {/* Product Meta Info */}
                <div className="flex flex-wrap lg:flex-nowrap justify-between text-sm flex-1 gap-4">
                  <div className="w-full sm:w-[45%]">
                    <h1 className="flex items-center mb-2">
                      <Store className="mr-2 text-green-400" /> Brand:{" "}
                      {product.brand}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <Clock className="mr-2 text-green-400" /> Added:{" "}
                      {moment(product.createdAt).fromNow()}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <Star className="mr-2 text-green-400" /> Reviews:{" "}
                      {product.numReviews}
                    </h1>
                  </div>

                  <div className="w-full sm:w-[45%]">
                    <h1 className="flex items-center mb-2">
                      <Star className="mr-2 text-green-400" /> Ratings:{" "}
                      {Math.round(product.rating)}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <ShoppingCart className="mr-2 text-green-400" /> Quantity:{" "}
                      {product.quantity}
                    </h1>
                    <h1 className="flex items-center mb-2">
                      <Box className="mr-2 text-green-400" /> In Stock:{" "}
                      {product.countInStock}
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
