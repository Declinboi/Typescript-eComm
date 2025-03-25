import { Product } from "../pages/Admin/AllProducts";

// Add a product to localStorage
export const addFavoriteToLocalStorage = (product: Product): void => {
  const favorites: Product[] = getFavoritesFromLocalStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Remove a product from localStorage
export const removeFavoriteFromLocalStorage = (productId: string): void => {
  const favorites: Product[] = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter(
    (product) => product._id !== productId
  );

  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};

// Retrieve favorites from localStorage
export const getFavoritesFromLocalStorage = (): Product[] => {
  const favoritesJSON = localStorage.getItem("favorites");
  return favoritesJSON ? (JSON.parse(favoritesJSON) as Product[]) : [];
};
