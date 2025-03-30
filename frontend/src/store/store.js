import { configureStore } from "@reduxjs/toolkit"
import languageReducer from "./features/languageSlice";
import filtersReducer from "./features/filtersSlice";
import productPageReducer from "./features/productPageSlice";
import reviewReducer from "./features/reviewSlice";
import favoriteReducer from "./features/favoriteSlice";
import loginReducer from "./features/loginStatusSlice";

export const store = configureStore({
    reducer:{
        language: languageReducer,
        filters: filtersReducer,
        productPageGlobalState: productPageReducer,
        review: reviewReducer,
        favorite: favoriteReducer,
        login: loginReducer
    }
});
