const apiUrl = import.meta.env.VITE_BACKEND_DOMAIN_URL;

export const getTrendingProductForHomePageUrl = `${apiUrl}/api/home/trendingProducts`;

export const categoryChinese = {
    WOMEN: "女裝",
    MEN: "男裝",
    COUPLE: "情侶裝"
}