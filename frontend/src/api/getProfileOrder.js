import { getProfileOrderUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const getProfileOrder = async () => {
    try {
        const response = await axiosInstance.get(getProfileOrderUrl);
        return response.data;
    } catch (error) {
        return [];
    }
}