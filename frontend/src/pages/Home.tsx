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
          <div className="flex justify-between items-center px-4">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-green-600 font-bold shadow-lg rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
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
