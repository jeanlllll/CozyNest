import axiosInstance from "./axiosInstance"
import { getCategoryProductForCategoryPageUrl } from './constant';

export async function fetchCategoryProduct(category, filters) {
    const baseUrl = getCategoryProductForCategoryPageUrl(category);
    const params = new URLSearchParams();
    
    if (filters.sortByArrivalDateDesc) {
        params.append("sortByArrivalDateDesc", filters.sortByArrivalDateDesc);
    } else if (filters.sortByPriceAsc) {
        params.append("sortByPriceAsc", filters.sortByPriceAsc);
    } else if (filters.sortByPriceDesc) {
        params.append("sortByPriceDesc", filters.sortByPriceDesc);
    } else if (filters.sortByRatingDesc) {
        params.append("sortByRatingDesc", filters.sortByRatingDesc);
    }

    params.append("page", filters.page || 0);
    params.append("size", 9);

    if (filters.isNewArrival) params.append("isNewArrival", filters.isNewArrival);
    if (filters.keywords) params.append("keywords", filters.keywords);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.sizes && filters.sizes.length > 0) {
        filters.sizes.forEach(size => {
            params.append("sizes", size);
        })
    }
    if (filters.categoryTypes && filters.categoryTypes.length > 0) {
        filters.categoryTypes.forEach(categoryType => {
            params.append("categoryTypes", categoryType);
        })
    }
    

    const fullUrl = `${baseUrl}?${params.toString()}`

    try {
        const response = await axiosInstance.get(fullUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching trending products: ", error);
        throw error;
    }
}