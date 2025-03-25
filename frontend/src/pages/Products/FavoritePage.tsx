import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favoriteSlice";
import ProductH from "./ProductH";
import { Product } from "../Admin/AllProducts";

const FavoritePage = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
        FAVORITE PRODUCTS
      </h1>

      <div className="flex flex-wrap">
        {favorites.map((product: Product) => (
          <ProductH key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
