// import { createSlice } from "@reduxjs/toolkit";
// import { updateCart } from "../../Utils/cartUtils";
// // import { updateCart } from "../../../Utils/cart";

// const initialState = localStorage.getItem("cart")
//   ? JSON.parse(localStorage.getItem("cart"))
//   : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const { user, rating, numReviews, reviews, ...item } = action.payload;
//       const existItem = state.cartItems.find((x) => x._id === item._id);

//       if (existItem) {
//         state.cartItems = state.cartItems.map((x) =>
//           x._id === existItem._id ? item : x
//         );
//       } else {
//         state.cartItems = [...state.cartItems, item];
//       }
//       return updateCart(state, item);
//     },

//     removeFromCart: (state, action) => {
//       state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
//       return updateCart(state);
//     },

//     saveShippingAddress: (state, action) => {
//       state.shippingAddress = action.payload;
//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     savePaymentMethod: (state, action) => {
//       state.paymentMethod = action.payload;
//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     clearCartItems: (state, action) => {
//       state.cartItems = [];
//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     resetCart: (state) => (state = initialState),
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   savePaymentMethod,
//   saveShippingAddress,
//   clearCartItems,
//   resetCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../Utils/cartUtils";

// ✅ Safely handle localStorage retrieval
const initialState = (() => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
})();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existItem = state.cartItems.find((x:any) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x:any) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      updateCart(state); // ✅ Don't return updateCart
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x:any ) => x._id !== action.payload);
      updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: () => initialState, // ✅ Correctly reset the state
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
