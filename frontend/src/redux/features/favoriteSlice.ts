import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../pages/Admin/AllProducts";
import { RootState } from "../store";



// Define the initial state type (array of Product)
type FavoriteState = Product[];

const initialState: FavoriteState = [];

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Product>) => {
      // Check if the product is not already in favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },  
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      return state.filter((product) => product._id !== action.payload);
    },
    setFavorites: (_state, action: PayloadAction<Product[]>) => {
      // Set the favorites from localStorage
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;
export const selectFavoriteProduct = (state: RootState ) =>
  state.favorites;

export default favoriteSlice.reducer;
