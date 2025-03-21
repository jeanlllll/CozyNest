import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import  {HomePage } from "./pages/HomePage.jsx";
import { ShopApplicationWrapper } from "./pages/ShopApplicationWrapper.jsx";
import { fetchTrendingProduct } from "./api/fetchTrendingProduct.js";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ShopApplicationWrapper/>,
        children: [
            {
                path: "",
                element: <HomePage/>,
                loader: fetchTrendingProduct,
            }
        ]
    }
])