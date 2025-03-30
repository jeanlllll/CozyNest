import { addFavoriteUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const addFavoriteFromFavoriteList = async (productId) => {
    try {
        const response = await axiosInstance.post(addFavoriteUrl(productId));
        return response.data;
    } catch (error) {
        console.error("Error in adding favorite item to favorite list: ", error);
        throw error;
    }
}