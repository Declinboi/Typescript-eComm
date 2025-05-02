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
          (product: Product) => {
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

  const handleBrandClick = (brand: any) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product: Product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value: any, id: any) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c: any) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product: Product) => product.brand)
          .filter((brand: any) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto shadow-lg rounded-md px-4 md:px-6">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}
          <div className="bg-gray-200 text-black p-3 mt-2 mb-2 md:w-[18rem] w-full">
            <h2 className="h4 text-center py-2 bg-green-600 rounded-lg mb-2">
              Filter by Categories
            </h2>

            <div className="p-5">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`category-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <label
                      htmlFor={`category-${c._id}`}
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
              {uniqueBrands?.map((brand: any, i: number) => (
                <div className="flex items-center mr-4 mb-5" key={i}>
                  <input
                    type="radio"
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h-4 text-green-400 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-2"
                  />
                  <label className="ml-2 text-sm font-medium">{brand}</label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-green-600 rounded-lg mb-2">
              Filter by Price
            </h2>

            <div className="p-5">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-green-400 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border-2 border-green-600 hover:bg-green-300 my-4"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="p-3 flex-1">
            <h2 className="text-3xl font-bold text-center mb-2">
              {products?.length} Products
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start">
              {products.length === 0 ? (
                <Loader className="h-8 w-8 animate-spin text-emerald-800" />
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
