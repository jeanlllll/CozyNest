export const getTrendingProductForHomePageUrl = "/api/home/trendingProducts";

export const getCategoryProductForCategoryPageUrl = (category) => {
    return `/api/product/category/${category}`
}

export const getGoogleOauth2Url = "/api/oauth2/google";

export const getGoogleOauth2Callback = "/api/oauth2/google/callback";

export const getcsrfTokenUrl = "/api/csrf/token";

export const getProductByIdUrl = (productId) => {
    return `/api/product/${productId}`
}

export const getLeaveReviewForProductUrl = (productId) => {
    return `/api/product/${productId}/review`
}

export const getReviewsByPageNSortUrl = (productId) => {
    return `/api/product/${productId}/reviews`
}

export const getFavoriteListUrl = "/api/favorites"

export const addFavoriteUrl = (productId) => {
    return `/api/favorites/add?productId=${productId}`
}

export const removeFavoriteUrl = (productId) => {
    return `/api/favorites/remove?productId=${productId}`
}

export const addItemToCartUrl = "/api/cart/add"

export const getCartListUrl = "/api/cart"

export const updateCartItemUrl = (cartItemId) => {
    return `/api/cart/update-quantity/${cartItemId}`
}

export const deleteCartItemUrl = (cartItemId) => {
    return `/api/cart/remove/${cartItemId}`
}

export const getDiscountCodeUrl = (discountCode) => {
    return `/api/discountCode?discountCode=${discountCode}`
}

export const postOrderUrl = "/api/orders"

export const getOrderIdStatusUrl = (sessionId) => {
    return `/api/payment/session/${sessionId}`
}

export const getOrderDetailByIdUrl = (orderId) => {
    return `/api/orders/${orderId}`
}

export const sendChatMessageUrl = "/api/ai/chat"

export const getChatHistoryUrl = (sessionId) => `/api/ai/history?sessionId=${sessionId}`

export const getUserProfileUrl = "/api/client/profile"

export const putUserProfileUrl = "/api/client/profile"

export const getProfileOrderUrl = "/api/orders"

export const getCheckIsLoginUrl = "/api/auth/checkLogin"

export const getLogoutUrl = "/api/auth/logout"

export const getSendSubscriptUrl = "/api/subscription/subscribe"

export const postManualLoginUrl = "/api/auth/login"

export const postRegisterUrl = "/api/auth/register"

export const getPostVerifyEMailUrl = "/api/auth/verify-email"

export const getResendVerificationCodeUrl = "/api/auth/forgot-password"