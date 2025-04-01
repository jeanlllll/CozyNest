import axiosInstance from "./axiosInstance";
import { addItemToCartUrl } from "./constant";

export const addProductToCart = async ({productId, productVariantId}) => {
    try {
        const response = await axiosInstance.post(addItemToCartUrl, {
            productId: productId,
            productVariantId: productVariantId
        })
        return response;
    } catch (error) {
        return error.response;
    }
}