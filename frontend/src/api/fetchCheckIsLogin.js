import axiosInstance from "./axiosInstance"
import { getCheckIsLoginUrl } from "./constant"

export const fetchCheckIsLogin  = () => {
    try {
        const response = axiosInstance.get(getCheckIsLoginUrl);
        return response;
    } catch (error) {
        return error.response;
    }
}