import { configureStore } from "@reduxjs/toolkit"
import languageReducer from "./features/languageSlice";
import filtersReducer from "./features/filtersSlice";
import productPageReducer from "./features/productPageSlice";
import reviewReducer from "./features/reviewSlice";

export const store = configureStore({
    reducer:{
        language: languageReducer,
        filters: filtersReducer,
        productPageGlobalState: productPageReducer,
        review: reviewReducer,
    }
});
