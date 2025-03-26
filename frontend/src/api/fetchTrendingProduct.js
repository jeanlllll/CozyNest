import axiosInstance from "./axiosInstance"
import { getTrendingProductForHomePageUrl } from './constant';

export async function fetchTrendingProduct() {
    try {
        const response = await axiosInstance.get(getTrendingProductForHomePageUrl); // Required for CSRF-protected requests
        return response.data;
    } catch (error) {
        console.error("Error fetching trending products: ", error);
        throw error;
    }
}