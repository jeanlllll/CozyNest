import { configureStore } from "@reduxjs/toolkit"
import languageReducer from "./features/languageSlice";
import filtersReducer from "./features/filtersSlice";

export const store = configureStore({
    reducer:{
        language: languageReducer,
        filters: filtersReducer,
    }
});
