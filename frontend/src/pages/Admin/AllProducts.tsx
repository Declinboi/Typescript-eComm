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
      <div className="container px-4 sm:px-6 md:px-[5rem]">
        <div className="flex flex-col md:flex-row">
          <div className="p-3 w-full">
            <AdminMenu />
            <div className="ml-[2rem] text-lg sm:text-xl font-bold h-12">
              All Products ({products?.length})
            </div>

            <div className="flex flex-wrap mt-4 justify-around shadow-lg border-2 border-green-400 items-center overflow-x-hidden">
              {products?.map((product: Product) => (
                <Link
                  key={product._id}
                  to={`/productupdate/${product._id}`}
                  className="block w-full sm:w-[90%] md:w-[48%] lg:w-[48%] xl:w-[45%] mt-2 mb-4 shadow-lg overflow-hidden"
                >
                  <div className="flex flex-row gap-4 p-2 rounded-lg bg-white hover:shadow-xl transition duration-300">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[6rem] sm:w-[8rem] md:w-[10rem] object-cover rounded-md shrink-0"
                    />
                    <div className="p-2 flex flex-col justify-between w-full">
                      <div className="flex justify-between flex-wrap items-center gap-2">
                        <h5 className="text-base sm:text-lg md:text-xl font-semibold">
                          {product?.name}
                        </h5>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="text-gray-500 text-xs sm:text-sm mt-1 mb-2 line-clamp-3">
                        {product?.description?.substring(0, 160)}...
                      </p>

                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <Link
                          to={`/productupdate/${product._id}`}
                          className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-pink-300"
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
                        <p className="text-sm font-semibold text-green-800">
                          $ {product?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
