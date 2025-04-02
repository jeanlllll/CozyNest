import { getUserProfileUrl } from "./constant";
import axiosInstance from "./axiosInstance";

export const fetchUserProfileInfo = async () => {
    try {
        const response = await axiosInstance.get(getUserProfileUrl); 
        return response.data;
    } catch (error) {
        return error.data;
    }
}