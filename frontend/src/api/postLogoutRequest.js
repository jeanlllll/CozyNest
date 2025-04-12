import axiosInstance from "./axiosInstance"
import { getLogoutUrl } from "./constant"

export const postLogooutRequest = async () => {
    try {
        const response = await axiosInstance.post(getLogoutUrl);
        return response;
    } catch (error) {
        return error.response;
    }
    
}