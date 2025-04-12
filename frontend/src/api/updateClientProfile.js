import { putUserProfileUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const updateClientProfile = async (profileObject) => {
    try {
        const response = await axiosInstance.put(putUserProfileUrl, profileObject);
        return response;
    } catch (error) {
        return error.response;
    }
}