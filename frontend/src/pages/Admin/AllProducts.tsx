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
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 p-4">
            <AdminMenu />
          </div>

          {/* Product List */}
          <div className="w-full md:w-3/4 p-4">
            <h2 className="text-2xl font-bold mb-4">
              All Products ({products?.length})
            </h2>

            <div className="flex flex-wrap gap-6 justify-center border-2 border-green-400 p-4 rounded-lg shadow-lg bg-white">
              {products?.map((product: Product) => (
                <Link
                  key={product._id}
                  to={`/productupdate/${product._id}`}
                  className="w-full md:w-[45%] lg:w-[40%] xl:w-[30%] bg-gray-50 rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
                    {/* Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-md"
                    />

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-lg font-semibold">
                            {product.name}
                          </h5>
                          <p className="text-xs text-gray-400">
                            {moment(product.createdAt).format("MMM Do YYYY")}
                          </p>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-3">
                          {product.description?.substring(0, 160)}...
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          to={`/productupdate/${product._id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-emerald-800 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          Update
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 14 10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <span className="font-semibold text-green-600">
                          ${product.price}
                        </span>
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
