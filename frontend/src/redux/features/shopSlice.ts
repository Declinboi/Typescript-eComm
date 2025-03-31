import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../pages/Admin/AllProducts";
import { Category } from "../../pages/Admin/CategoryList";

interface ShopState {
  categories: Category[];
  products: Product[]; // Replace `any` with a proper Product type if available
  checked: string[];
  radio: number[];
  brandCheckboxes: Record<string, boolean>;
  checkedBrands: string[];
}

const initialState: ShopState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  brandCheckboxes: {},
  checkedBrands: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[] | undefined>) => {
      state.categories = action.payload ?? [];
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload;
    },
    setRadio: (state, action: PayloadAction<number[]>) => {
      state.radio = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string[]>) => {
      state.checkedBrands = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
} = shopSlice.actions;

export default shopSlice.reducer;
