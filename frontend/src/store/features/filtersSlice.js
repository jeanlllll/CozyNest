import { createSlice } from "@reduxjs/toolkit";
import { categoryType } from "../../assets/data/data";

const initialState =  {
    categoryTypes: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 300,
    keywords: "",
    sortBy: ""
}

const filtersSlice = createSlice({
  name: "filters",
  initialState: initialState,
  reducers: {
    setCategoryTypes: (state, action) => {
      state.categoryTypes = action.payload;
    },
    updateCategoryTypes: (state, action) => {
        const value = action.payload;
        const exist = state.categoryTypes.includes(value);
        if (exist) {
            state.categoryTypes = state.categoryTypes.filter((item) => item !== value);
        } else {
          state.categoryTypes.push(value);
        }
    },
    setSizes: (state, action) => {
      state.sizes = action.payload;
    },
    updateSizes: (state, action) => {
        const value = action.payload;
        const exist = state.sizes.includes(value);
        if (exist) {
            state.sizes = state.sizes.filter((size) => size !== value);
        } else {
            state.sizes.push(value);
        }
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setKeywords: (state, action) => {
      state.keywords = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.categoryTypes = [];
      state.sizes = [];
      state.minPrice = 0;
      state.maxPrice = 300;
      state.keywords = "";
      state.sortBy = "";
    }
  }
});

export const {
  setCategoryTypes,
  updateCategoryTypes,
  setSizes,
  updateSizes,
  setMinPrice,
  setMaxPrice,
  setKeywords,
  setSortBy,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;