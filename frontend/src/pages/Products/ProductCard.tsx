import { Link } from "react-router-dom";
import {ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { Product } from "../Admin/AllProducts";

const ProductCard = ({ p }:any) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product:Product, qty:any) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  return (
    <div className="max-w-sm relative bg-gray-100 rounded-lg shadow-lg px-4 ">
      <section className="relative">
        <Link to={`/product-details/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full shadow-lg">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full rounded-2xl"
            src={p.image}
            alt={p.name}
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-xl ">{p?.name}</h5>

          <p className=" font-semibold text-green-500">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-3 font-normal text-sm text-gray-500">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product-details/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-gray-400"
          >
            Read More
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

          <button
            className="p-2 rounded-full"
            onClick={() => addToCartHandler(p, 1)}
          >
            <ShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
