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
      <div className="flex flex-col xl:flex-row justify-center items-start px-4 gap-6">
        {/* Product Grid - visible on xl and above */}
        <div className="hidden xl:block w-full xl:w-[40%">
          <div className="grid grid-cols-2 gap-4 shadow-lg rounded-lg">
            {data?.map((product: Product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Carousel - always visible, stacked below on small screens */}
        <div className="w-full xl:w-[60%]">
          <ProductCarousel />
        </div>
      </div>
    </>
  );
};

export default Header;
