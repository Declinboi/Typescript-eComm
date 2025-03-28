import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { Loader } from "lucide-react";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  brand: string;
  image: string;
  countInStock: number;
  createdAt: string; // or `Date` if it's a Date object
  numReviews?: string;
  rating: number;
}

const AllProducts = () => {
  const { data: products, error, isLoading } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-emerald-800" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <div className="container mx-[9rem]">
        <div className="flex flex-col  md:flex-row">
          <div className="p-3">
            <AdminMenu />
            <div className="ml-[2rem]  text-xl font-bold h-12">
              All Products ({products?.length})
            </div>
            <div className="flex flex-wrap justify-around items-center">
              {products?.map((product: Product) => (
                <Link
                  key={product._id}
                  to={`/productupdate/${product._id}`}
                  className="block mb-4 overflow-hidden"
                >
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[10rem] object-cover"
                    />
                    <div className="p-4 flex flex-col justify-around">
                      <div className="flex justify-between">
                        <h5 className="text-xl font-semibold mb-2">
                          {product?.name}
                        </h5>

                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                        {product?.description?.substring(0, 160)}...
                      </p>

                      <div className="flex justify-between">
                        <Link
                          to={`/productupdate/${product._id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                        >
                          Update Product
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <p>$ {product?.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
