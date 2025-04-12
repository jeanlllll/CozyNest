import React from 'react';
import { createBrowserRouter, useParams } from "react-router-dom";
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
import { CartEntirePage } from './pages/CartEntirePage.jsx';
import { fetchCartList } from './api/fetchCartList.js';
import { CheckoutEntirePage } from './pages/CheckoutEntirePage.jsx';
import { fetchUserProfileInfo } from './api/fetchUserProfile.js';
import { getOrderPaymentStatus } from './api/getOrderPaymentStatus.js';
import { PaymentSummaryPage } from './pages/PaymentSummaryPage.jsx';
import { OrderDetailPage } from './pages/OrderDetailPage.jsx';
import { getOrderDetailById } from './api/getOrderDetailById.js';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { getProfileOrder } from './api/getProfileOrder.js';
import { OrderPage } from './pages/OrderPage.jsx';
import { RootLayout } from './components/RootLayout.jsx';
import { AIChatBoxFullScreenPage } from './pages/AIChatBoxFullScreenPage.jsx';
import { VerifyPage } from './pages/VerifyPage.jsx';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
                loader: fetchTrendingProduct
            },
            {
                path: "user",
                element: <LoginNRegisterWrapper />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />
                    },
                    {
                        path: "register",
                        element: <RegisterPage />
                    },
                    {
                        path: "verify-email",
                        element: <VerifyPage/>
                    }
                ]
            },
            {
                path: "category/:category",
                children: [
                    {
                        index: true,
                        element: <CategoryEntirePage />,
                        loader: async ({ params, request }) => {
                            const filter = parseQueryFilters(request);
                            return fetchCategoryProduct(params.category, filter);
                        }
                    },
                    {
                        path: ":categoryType/:productName/:productId/:language",
                        element: <ProductEntirePage />,
                        loader: async ({ params }) => {
                            return fetchProductByProductId(params.productId, params.language);
                        }
                    }
                ]
            },
            {
                path: "oauth2/google/callback",
                element: <Oauth2CallbackPage />
            },
            {
                path: "user",
                children: [
                    {
                        path: "favorite",
                        element: <FavoritesPage/>,
                        loader: fetchFavoriteList
                    },
                    {
                        path: "cart",
                        element: <CartEntirePage />,
                        loader: fetchCartList
                    },
                    {
                        path: "checkout",
                        element: <CheckoutEntirePage />,
                        loader: fetchUserProfileInfo
                    },
                    {
                        path: "payment",
                        element: <PaymentSummaryPage />,
                        loader: async ({ request }) => {
                            const url = new URL(request.url);
                            const sessionId = url.searchParams.get("session_id");

                            if (!sessionId || sessionId === "null") {
                                console.warn("Missing or invalid session_id in URL");
                                return { error: "Invalid session ID" };
                            }

                            return getOrderPaymentStatus(sessionId);
                        }
                    },
                    {
                        path: "order/:orderId",
                        element: <OrderDetailPage />,
                        loader: async ({ params, request }) => {
                            const { orderId } = params;
                            return getOrderDetailById(orderId);
                        }
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />,
                        loader: fetchUserProfileInfo
                    },
                    {
                        path: "orders",
                        element: <OrderPage />,
                        loader: getProfileOrder
                    }
                ]
            },
            {
                path: "ai/chatbox",
                element: <AIChatBoxFullScreenPage/>
            }
        ]

    }

])