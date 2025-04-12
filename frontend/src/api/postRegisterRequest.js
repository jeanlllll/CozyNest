import axiosInstance from "./axiosInstance";
import { postRegisterUrl } from "./constant";

export const postRegisterRequest = async ({firstName, lastName, email, password, confirmPassword, subscribe}) => {
    try {
        const response = await axiosInstance.post(postRegisterUrl, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            subscribe: subscribe
        });
        return response;
    } catch (error) {
        return error.response;
    }
}