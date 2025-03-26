import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import  {HomePage } from "./pages/HomePage.jsx";
import { ShopApplicationWrapper } from "./pages/ShopApplicationWrapper.jsx";
import { fetchTrendingProduct } from "./api/fetchTrendingProduct.js";
import { LoginNRegisterWrapper } from './pages/LoginNRegisterWrapper.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { CategoryPage } from './pages/CategoryPage.jsx';
import { fetchCategoryProduct } from "./api/fetchCategoryProduct.js"
import { parseQueryFilters } from './Helper/parseQueryFilters.js';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
        loader: fetchTrendingProduct
    },
    {
        path: "/user",
        element: <LoginNRegisterWrapper/>,
        children: [
            {   
                path: "login",
                element: <LoginPage/>
            },
            {
                path: "register",
                element: <RegisterPage/>
            }
        ]
    },
    {
        path: "/category/:category",
        element: <ShopApplicationWrapper needSearchBar={false}/>,
        children: [
            {   
                path: "",
                element: <CategoryPage/>,
                loader: async ({params, request}) => {
                    const filter = parseQueryFilters(request);
                    return fetchCategoryProduct(params.category, filter);
                }
            }
        ]
    },
    // {
    //     path: "/oauth2/google",
    //     loader: fetchGoogleOauth2Callback
    // }
])