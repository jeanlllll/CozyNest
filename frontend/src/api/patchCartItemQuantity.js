import { updateCartItemUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const patchCartItemQuantity = async (cartItemId, quantity) => {
    try {
        const response = await axiosInstance.patch(updateCartItemUrl(cartItemId), {
            quantity: quantity
        })
        return response;
    } catch (error) {
        return error.response;
    }
}