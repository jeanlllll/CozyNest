import axiosInstance from "./axiosInstance";
import { getReviewsByPageNSortUrl } from "./constant";

export const fetchReviewsByPageNSortUrl = async (productId, page, size, sortBy) => {
    try {
        const params = {
            page: page,
            size: size,
        }

        if (sortBy !== null && sortBy !== undefined) {
            params.sortBy = sortBy;
        }

        const response = await axiosInstance.get(getReviewsByPageNSortUrl(productId), {params})
        return response;
    } catch (error) {
        return error.response;
    }
}

//sorting criteria: rating or createdOn