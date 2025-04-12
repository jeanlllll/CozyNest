import axiosInstance from "./axiosInstance"
import { postManualLoginUrl } from "./constant";

export const postManualLogin = async ({email, password}) => {
    try {
        const response = await axiosInstance.post(postManualLoginUrl, {
            email: email, 
            password: password
        });
        return response;
    } catch (error) {
        return error.response;
    }
    
}