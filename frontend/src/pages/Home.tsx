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
          <div className="flex flex-col md:flex-row justify-between items-center px-4 mt-20 md:mt-40">
            <h1 className="text-3xl text-center md:text-5xl font-bold mb-4 md:mb-0 md:ml-20">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-green-600 font-bold shadow-lg rounded-full py-2 px-10 md:mr-20"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-8 rounded-lg shadow-lg gap-4">
              {data.products.map((product: Product) => (
                <div key={product._id}>
                  <ProductH product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
