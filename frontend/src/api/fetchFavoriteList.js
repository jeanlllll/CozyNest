import { getFavoriteListUrl } from "./constant";
import axiosInstance from "./axiosInstance";
import { redirect } from "react-router";

export const fetchFavoriteList = async () => {
    try {
        const response = await axiosInstance.get(getFavoriteListUrl);
        return response.data;
    } catch (error) {
        if (error.response && [401, 403].includes(error.response.status)) {
            throw redirect("/user/login");
        }
        throw error;
    }
}
