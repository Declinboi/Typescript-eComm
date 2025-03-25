import { useEffect } from "react";
import { Heart, HeartCrack } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Product } from "../Admin/AllProducts";


import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon : React.FC<{product:Product}> = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: { favorites: Product[] }) => state.favorites) || [];


  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product._id));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      // add the product to localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <Heart className="text-pink-500" />
      ) : (
        <HeartCrack className="text-white" />
      )}
    </div>
  );
};

export default HeartIcon;
