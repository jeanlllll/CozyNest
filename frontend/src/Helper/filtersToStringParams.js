import { categoryType } from "../assets/data/data";
import { sizeList } from "../assets/data/data";
import { useSelector } from "react-redux";

export const fitlersToStringParams = ({category, filters}) => {
    const params = new URLSearchParams();

    if (filters.categoryTypes.length > 0 && filters.categoryTypes.length !== categoryType[category].length) {
        filters.categoryTypes.forEach((type) => 
            params.append("categoryTypes", type)
        );
    }
    if (filters.sizes.length > 0 && filters.sizes.length !== sizeList.length) {
        console.warn("filters.categoryTypes is not an array:", filters.categoryTypes);
        filters.sizes.forEach((size) => 
            params.append("sizes", size)
        );
    }

    if (filters.minPrice != 0 || filters.maxPrice != 300) {
        params.append("minPrice", filters.minPrice);
        params.append("maxPrice", filters.maxPrice);
    }

    if (filters.sortBy !== "") {
        params.append(filters.sortBy, true);
    }
    if (filters.keywords !== "") {
        params.append("keywords", filters.keywords);
    }

    return params.toString();
}