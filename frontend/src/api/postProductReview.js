import axiosInstance from "./axiosInstance";
import { getLeaveReviewForProductUrl } from "./constant";

export const postProductReview = async (rating, comments, productId) => {
    try {
        const response = await axiosInstance.post(getLeaveReviewForProductUrl(productId), { rating: rating, comments: comments });
        return response;
    } catch (error) {
        return error.response;
    }
}