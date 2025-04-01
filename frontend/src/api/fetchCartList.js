import axiosInstance from "./axiosInstance"
import { getCartListUrl } from './constant';

export async function fetchCartList() {
    try {
        const response = await axiosInstance.get(getCartListUrl);
        return response.data;
    } catch (error) {
        return response.data;
    }
}