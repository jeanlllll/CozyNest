import { getFavoriteListUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const fetchFavoriteList = async () => {
    try {
        const response = await axiosInstance.get(getFavoriteListUrl);
        return response.data;
    } catch (error) {
        console.error("Error in getting favorite list: ", error);
        throw error;
    }
}