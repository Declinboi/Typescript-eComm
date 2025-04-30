import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { Product } from "../Admin/AllProducts";

const ProductH: React.FC<{product:Product} > = ({ product }) => {
  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative rounded-lg shadow-lg ">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-[30rem] rounded-lg"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4 rounded-lg shadow-lg">
        <Link to={`/product-details/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name}</div>
            <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-lg ">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default ProductH;
