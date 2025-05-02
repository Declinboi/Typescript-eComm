import { Loader } from "lucide-react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";

import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { Product } from "../pages/Admin/AllProducts";



const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-emerald-800" />
      </div>
    );
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex justify-around px-4 ">
        <div className="xl:block hidden md:hidden">
          <div className="grid grid-cols-2 shadow-lg rounded-lg">
            {data?.map((product: Product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;
