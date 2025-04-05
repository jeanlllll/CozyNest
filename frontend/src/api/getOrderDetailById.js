import axiosInstance from "./axiosInstance";
import { getOrderDetailByIdUrl } from "./constant";

export const getOrderDetailById = async (orderId) => {
    try {
        const response = await axiosInstance.get(getOrderDetailByIdUrl(orderId));
        return response.data;
    } catch (error) {
        return response.data;
    }
}