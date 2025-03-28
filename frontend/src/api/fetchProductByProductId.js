import { getProductByIdUrl } from "./constant"
import axiosInstance from "./axiosInstance";
import { useSelector } from "react-redux";

export async function fetchProductByProductId(productId, language) {

    try {
        const response = await axiosInstance.get(getProductByIdUrl(productId), 
        {
            headers: {
                "accept-language": language
            }
        }); 
        return response.data;
    } catch (error) {
        console.error("Error: fail for fetching product detail by product Id", error);
        throw error;
    }
}