import { useSelector } from "react-redux";
import { Product } from "../Admin/AllProducts";

const FavoritesCount = () => {
    const favorites = useSelector((state: { favorites: Product[] }) => state.favorites) || [];
  const favoriteCount = favorites.length;

  return (
    <div className="absolute md:left-2 md:top-8 sm:top-8 sm:left-2 left-0 top-2 ">
      {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
