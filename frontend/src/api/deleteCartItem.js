import { deleteCartItemUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const deleteCartItem = async ({ cartItemId }) => {
    try {
        const response = await axiosInstance.delete(deleteCartItemUrl(cartItemId))
        return response;
    } catch (error) {
        return error.response?.data || { error: "Unknown error occurred" };
    }
}
