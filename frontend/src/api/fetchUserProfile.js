import { getUserProfileUrl } from "./constant";
import axiosInstance from "./axiosInstance";
import { redirect } from "react-router";

export const fetchUserProfileInfo = async () => {
    try {
        const response = await axiosInstance.get(getUserProfileUrl);
        return response.data;
    } catch (error) {
        if (error.response && [401, 403].includes(error.response.status)) {
            throw redirect("/user/login");
        }
        return error.data;
    }
}