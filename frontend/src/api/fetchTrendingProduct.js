import axios from 'axios';
import { getTrendingProductForHomePageUrl } from './constant';

export async function fetchTrendingProduct() {
    try {
        const response = await axios.get(getTrendingProductForHomePageUrl, {
            withCredentials: true // Required for CSRF-protected requests
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching trending products: ", error);
        throw error;
    }
}