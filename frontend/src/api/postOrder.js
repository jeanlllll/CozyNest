import axiosInstance from "./axiosInstance";
import { postOrderUrl } from "./constant";

export const postOrder = async (orderCartItemDtoList, shippingInfoDto, deliveryMethod, discountCode) => {
    try {
        const response = await axiosInstance.post(postOrderUrl, {
            orderCartItemDtoList: orderCartItemDtoList, 
            shippingInfoDto: shippingInfoDto,
            deliveryMethod: deliveryMethod,
            discountCode: discountCode,
        });
        return response;
    } catch (error) {
        return error.response;
    }
}