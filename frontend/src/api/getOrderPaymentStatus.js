import { getOrderIdStatusUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const getOrderPaymentStatus = async (sessionId) => {
    if (!sessionId || sessionId === "null") {
        return { error: "Session ID is missing or invalid" };
    }

    try {
        const response = await axiosInstance.get(getOrderIdStatusUrl(sessionId));
        return response.data;
    } catch (error) {
        return error?.response?.data || { error: "Failed to fetch payment status" };
    }
}