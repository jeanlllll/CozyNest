import axiosInstance from "./axiosInstance";
import { getSendSubscriptUrl } from "./constant";

export const postSubscription = async (email) => {

    try {
        const response = await axiosInstance.post(getSendSubscriptUrl, 
        {
            email: email
        });
        return response;
    } catch (error) {
        return error.response;
    }

}