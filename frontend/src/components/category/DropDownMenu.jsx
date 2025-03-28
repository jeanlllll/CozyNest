import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fitlersToStringParams } from "../../Helper/filtersToStringParams";
import { setSortBy } from "../../store/features/filtersSlice";

export const DropDownMenu = ({ isEnglish, category }) => {
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters)

    const sortBy = filters.sortBy;

    const hanldeSortByOnClick = (sortCriteria) => {
        if (sortBy !== sortCriteria) {
            dispatch(setSortBy(sortCriteria))
        }
    }

    useEffect(() => {
        const queryString = fitlersToStringParams({ category, filters });
        navigate(`/category/${category}?${queryString}`);
        setOpen(false);
    }, [filters.sortBy]);

    return (
        <div className="relative inline-block">
            <button
                onClick={toggleDropdown}
                className="text-white bg-gray-800 focus:ring-4 focus:outline-none 
             font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center cursor-pointer"
            >
                {isEnglish ? "Sort by" : "排序方式"}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-35 drop-shadow-lg">
                    <ul className="py-2 text-sm text-gray-700">
                        <li>
                            <div onClick={() => hanldeSortByOnClick("sortByArrivalDateDesc")}
                                className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer 
                                ${sortBy === "sortByArrivalDateDesc" ? "text-black font-bold" : "font-normal"}`}>
                                {isEnglish ? "New Arrival" : "最新上架"}
                            </div>
                        </li>
                        <li>
                            <div onClick={() => hanldeSortByOnClick("sortByPriceAsc")}
                                className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer 
                                ${sortBy === "sortByPriceAsc" ? "text-black font-bold" : "font-normal"}`}>
                                {isEnglish ? "Price ascending" : "價格：由低至高"}
                            </div>
                        </li>
                        <li>
                            <div onClick={() => hanldeSortByOnClick("sortByPriceDesc")}
                                className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer 
                                ${sortBy === "sortByPriceDesc" ? "text-black font-bold" : "font-normal"}`}>
                                {isEnglish ? "Price descending" : "價格：由高至低"}
                            </div>
                        </li>
                        <li>
                            <div onClick={() => hanldeSortByOnClick("sortByRatingDesc")}
                                className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer 
                                ${sortBy === "sortByRatingDesc" ? "text-black font-bold" : "font-normal"}`}>
                                {isEnglish ? "Rating" : "評價"}
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
