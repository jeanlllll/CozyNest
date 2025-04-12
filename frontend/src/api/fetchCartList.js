import axiosInstance from "./axiosInstance"
import { getCartListUrl } from './constant';
import { redirect } from "react-router";

export async function fetchCartList() {
    try {
        const response = await axiosInstance.get(getCartListUrl);
        return response.data;
    } catch (error) {
        if (error.response && [401, 403].includes(error.response.status)) {
            throw redirect("/user/login");
        }
        throw error;
    }
}