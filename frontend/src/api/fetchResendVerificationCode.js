import axiosInstance from "./axiosInstance";
import { getResendVerificationCodeUrl } from "./constant";

export const fetchResendVerificationCode = async ({email}) => {

    try {
        const response = await axiosInstance.post(getResendVerificationCodeUrl, 
        {
           email: email
        }); 
        return response;
    } catch (error) {
        return error.response;
    }
}