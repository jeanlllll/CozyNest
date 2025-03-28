import axiosInstance from "./axiosInstance";
import { getLeaveReviewForProductUrl } from "./constant";

export const postProductReview = async (rating, comments, productId) => {
    try {
        const response = await axiosInstance.post(getLeaveReviewForProductUrl(productId), { rating, comments });
        return response;
    } catch (error) {
        console.error("Error posting review for product failed: ", error);
        throw error;
    }
}