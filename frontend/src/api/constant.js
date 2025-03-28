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


