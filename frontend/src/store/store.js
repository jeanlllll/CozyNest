import { configureStore } from "@reduxjs/toolkit"
import languageReducer from "./features/languageSlice";
import filtersReducer from "./features/filtersSlice";
import productPageReducer from "./features/productPageSlice";
import reviewReducer from "./features/reviewSlice";
import favoriteReducer from "./features/favoriteSlice";
import orderReducer from "./features/orderSlice";
import cartReducer from "./features/CartItemsSlice";
import chatReducer from "./features/chatHistory";
import authReducer from "./features/authSlice";

export const store = configureStore({
    reducer:{
        language: languageReducer,
        filters: filtersReducer,
        productPageGlobalState: productPageReducer,
        review: reviewReducer,
        favorite: favoriteReducer,
        order: orderReducer,
        cart: cartReducer,
        chat: chatReducer,
        auth: authReducer
    }
});
