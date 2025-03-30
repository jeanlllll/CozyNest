import { removeFavoriteUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const removeFavoriteFromFavoriteList = async (productId) => {
    try {
        const response = await axiosInstance.post(removeFavoriteUrl(productId));
        return response.data;
    } catch (error) {
        console.error("Error in removing favorite item in favorite list: ", error);
        throw error;
    }
}