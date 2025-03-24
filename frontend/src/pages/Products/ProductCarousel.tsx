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
          className="xl:w-[50rem]  lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {products?.map((products: Product) => (
            <div key={products._id}>
              <img
                src={products?.image}
                alt={products.name}
                className="w-full rounded-lg object-cover h-[30rem]"
              />

              <div className="mt-4 flex justify-between">
                <div className="one">
                  <h2>{products.name}</h2>
                  <p> $ {products.price}</p> <br /> <br />
                  <p className="w-[25rem]">
                    {products?.description.substring(0, 170)} ...
                  </p>
                </div>

                <div className="flex justify-between w-[20rem]">
                  <div className="one">
                    <h1 className="flex items-center mb-6">
                      <Store className="mr-2 text-white" /> Brand:{" "}
                      {products?.brand}
                    </h1>
                    <h1 className="flex items-center mb-6">
                      <Clock className="mr-2 text-white" /> Added:{" "}
                      {moment(products?.createdAt).fromNow()}
                    </h1>
                    <h1 className="flex items-center mb-6">
                      <Star className="mr-2 text-white" /> Reviews:
                      {products?.numReviews}
                    </h1>
                  </div>

                  <div className="two">
                    <h1 className="flex items-center mb-6">
                      <Star className="mr-2 text-white" /> Ratings:{" "}
                      {Math.round(products?.rating)}
                    </h1>
                    <h1 className="flex items-center mb-6">
                      <ShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                      {products.quantity}
                    </h1>
                    <h1 className="flex items-center mb-6">
                      <Box className="mr-2 text-white" /> In Stock:{" "}
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
