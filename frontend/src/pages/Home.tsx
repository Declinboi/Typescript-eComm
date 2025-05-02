import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";

import Message from "../components/Message";
import Header from "../components/Header";
import { Loader } from "lucide-react";
import { Product } from "./Admin/AllProducts";
import ProductH from "./Products/ProductH";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <>
      <div className="w-full">
        {!keyword ? <Header /> : null}

        {isLoading ? (
          <Loader className="h-8 w-8 animate-spin text-emerald-800" />
        ) : error ? (
          <Message variant="error">
            {(error as { data?: { message?: string }; error?: string })?.data
              ?.message || (error as { error?: string })?.error}
          </Message>
        ) : (
          <>
            {/* Heading & Button */}
            <div className="flex flex-col md:flex-row justify-between items-center px-4 mt-16 sm:mt-20 md:mt-40 gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl text-center font-bold">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="bg-green-600 text-white font-bold shadow-lg rounded-full py-2 px-6 sm:px-10 transition duration-300 hover:bg-emerald-700"
              >
                Shop
              </Link>
            </div>

            {/* Products */}
            <div className="flex justify-center flex-wrap mt-8 rounded-lg shadow-lg gap-4 px-4 sm:px-6 md:px-10">
              {data.products.map((product: Product) => (
                <div
                  key={product._id}
                  className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%]"
                >
                  <ProductH product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
