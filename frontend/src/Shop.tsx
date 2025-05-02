import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setCategories,
  setProducts,
  setChecked,
} from "./redux/features/shopSlice";
// import Loader from "../components/Loader";
import ProductCard from "./pages/Products/ProductCard";
import { RootState } from "./redux/store";
import { useFetchCategoriesQuery } from "./redux/api/categoryApiSlice";
import { useGetFilteredProductsQuery } from "./redux/api/productApiSlice";
import { Product } from "./pages/Admin/AllProducts";
import { Loader } from "lucide-react";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state: RootState) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product:Product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand:any) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product:Product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value:any, id:any) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c:any) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product:Product) => product.brand)
          .filter((brand:any) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container md:ml-[3rem] mx-auto shadow-lg rounded-md">
        <div className="flex md:flex-row">
          <div className="bg-gray-200 text-black p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-green-600 rounded-lg mb-2">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex ietms-center mr-4">
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />

                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-sm font-medium"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-green-600 rounded-lg mb-2">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand:any) => (
                <>
                  <div className="flex items-enter mr-4 mb-5">
                    <input
                      type="radio"
                      // id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-green-400 bg-gray-100 border-gray-300 focus:ring-green-500  focus:ring-2"
                    />

                    <label
                      htmlFor="pink-radio"
                      className="ml-2 text-sm font-medium"
                    >
                      {brand}
                    </label>
                  </div>
                </>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-green-600 rounded-lg mb-2">
              Filer by Price
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-green-400 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              />
            </div>

            <div className="p-5 pt-0 ">
              <button
                className="w-full border-2 border-green-600 hover:bg-green-300  my-4 "
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-3xl font-bold text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader className="h-8 w-8 animate-spin text-emerald-800"/>
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
