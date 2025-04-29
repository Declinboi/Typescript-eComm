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
  console.log(products)

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
    <div className="mb-4 lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="error">
          {(error as { data?: { message?: string }; error?: string })?.data
            ?.message || (error as { error?: string })?.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[40rem]  lg:w-[35rem] md:w-[30rem] sm:w-[25rem] sm:block rounded-lg shadow-lg bg-gray-100"
        >
          {products?.map((products: Product) => (
            <div key={products._id}>
              <img
                src={products?.image}
                alt={products.name}
                className="w-full rounded-lg object-cover h-[30rem]"
              />

              <div className="mt-4 flex justify-between">
                <div className="ml-4 one">
                  <h2 className="font-bold">{products.name}</h2>
                  <p className="mt-2 text-green-500"> $ {products.price}</p> <br /> 
                  <p className=" text-sm w-[18rem]">
                    {products?.description.substring(0, 160)} ...
                  </p>
                </div>

                <div className="flex justify-between text-sm w-[15rem]">
                  <div className="one w-full">
                    <h1 className="flex text-sm mb-2  ">
                      <Store className=" mr-2 text-green-400 " /> Brand:{" "}
                      {products?.brand}
                    </h1>
                    <h1 className="flex mb-6 ">
                      <Clock className="mr-2 text-green-400" /> Added:{" "}
                      {moment(products?.createdAt).fromNow()}
                    </h1>
                    <h1 className="flex mb-6">
                      <Star className="mr-2 text-green-400" /> Reviews:
                      {products?.numReviews}
                    </h1>
                  </div>

                  <div className="two w-full">
                    <h1 className="flex mb-6">
                      <Star className="mr-2 text-green-400" /> Ratings:{" "}
                      {Math.round(products?.rating)}
                    </h1>
                    <h1 className="flex mb-6">
                      <ShoppingCart className="mr-2 text-green-400" /> Quantity:{" "}
                      {products.quantity}
                    </h1>
                    <h1 className="flex mb-6">
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
