// import { HeartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../Admin/AllProducts";
import HeartIcon from "./HeartIcon";

const SmallProduct: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] py-3 px-4 shadow-lg rounded-lg">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.name}
          className="h-auto rounded-lg"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product-details/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
