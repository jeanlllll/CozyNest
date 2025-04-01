import { getDiscountCodeUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const verifyDiscountCode = async (discountCode) => {
    try {
        const response = await axiosInstance.get(getDiscountCodeUrl(discountCode));
        return response;
    } catch (error) {
        return error.response;
    }
}