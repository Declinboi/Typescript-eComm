import { useSelector } from "react-redux";
import { Product } from "../Admin/AllProducts";

const FavoritesCount = () => {
    const favorites = useSelector((state: { favorites: Product[] }) => state.favorites) || [];
  const favoriteCount = favorites.length;

  return (
    <div className="absolute sm:left-2 sm:top-8 left-0 top-0 ">
      {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
