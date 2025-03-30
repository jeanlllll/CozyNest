import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage.jsx";
import { ShopApplicationWrapper } from "./pages/ShopApplicationWrapper.jsx";
import { fetchTrendingProduct } from "./api/fetchTrendingProduct.js";
import { LoginNRegisterWrapper } from './pages/LoginNRegisterWrapper.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { CategoryPage } from './pages/CategoryPage.jsx';
import { fetchCategoryProduct } from "./api/fetchCategoryProduct.js"
import { parseQueryFilters } from './Helper/parseQueryFilters.js';
import { CategoryEntirePage } from "./pages/CategoryEntirePage.jsx"
import { Oauth2CallbackPage } from './pages/OAuthCallbackPage.jsx';
import { fetchProductByProductId } from './api/fetchProductByProductId.js';
import { ProductPage } from './pages/ProductPage.jsx';
import { ProductEntirePage } from './pages/ProductEntirePage.jsx';
import { fetchFavoriteList } from './api/fetchFavoriteList.js';
import { FavoritesPage } from './pages/FavoritesPage.jsx';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        loader: fetchTrendingProduct
    },
    {
        path: "/user",
        element: <LoginNRegisterWrapper />,
        children: [
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "register",
                element: <RegisterPage />
            }
        ]
    },
    {
        path: "/category/:category",
        children: [
            {
                path: "",
                element: <CategoryEntirePage />,
                loader: async ({ params, request }) => {
                    const filter = parseQueryFilters(request);
                    return fetchCategoryProduct(params.category, filter);
                }
            },
            {
                path: ":categoryType/:productName/:productId/:language",
                element: <ProductEntirePage/>,
                loader: async ({params}) => {
                    return fetchProductByProductId(params.productId, params.language);
                }
            }
        ]
    },
    {
        path: "/oauth2/google/callback",
        element: <Oauth2CallbackPage />
    },
    {
        path: "/user/favorite",
        element: <FavoritesPage />,
        loader: fetchFavoriteList
    }
])