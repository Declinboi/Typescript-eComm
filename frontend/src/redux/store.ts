import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
// import favoritesReducer from "../redux/features/favorites/favoriteSlice";
// import cartSliceReducer from "../redux/features/cart/cartSlice";
// import shopReducer from "../redux/features/shop/shopSlice";
// import { getFavoritesFromLocalStorage } from "../Utils/localStorage";

// const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    // favorites: favoritesReducer,
    // cart: cartSliceReducer,
    // shop: shopReducer,
  },

//   preloadedState: {
//     favorites: initialFavorites,
//   },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

// ✅ Export RootState type
export type RootState = ReturnType<typeof store.getState>;

// ✅ Export AppDispatch type for dispatching actions
export type AppDispatch = typeof store.dispatch;

export default store;


