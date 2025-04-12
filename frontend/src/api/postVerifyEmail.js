import axiosInstance from "./axiosInstance";
import { getPostVerifyEMailUrl } from "./constant";

export const postVerifyEmail = async ({email, verificationCode}) => {

    try {
        const response = await axiosInstance.post(getPostVerifyEMailUrl, 
        {
            email: email,
            code: verificationCode
        });
        return response;
    } catch (error) {
        return error.response;
    }

}