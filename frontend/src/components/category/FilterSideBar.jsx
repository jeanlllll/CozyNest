import { PriceSlider } from "./PriceSlider"
import { CustomBottomCategroy } from "./CustomBottomCategory";
import { updateCategoryTypes, updateSizes } from "../../store/features/filtersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { fitlersToStringParams } from "../../Helper/filtersToStringParams";
import { useState, useRef } from "react";
import { WarningIcon } from "../../assets/icons/WarningIcon";
import { categoryList, categoryTypeChinese } from "../../assets/data/data";
import { categoryChinese } from "../../assets/data/data";

export const FilterSideBar = ({ categoryTypeList, sizeList, category, isEnglish, isMobile }) => {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters)
    const navigate = useNavigate();
    const isFirstRender = useRef(true);
    const navigationTimeoutRef = useRef(null);
    const previousCategory = useRef(category);

    const [showAlertForCategoryTypes, setShowAlertForCategoryTypes] = useState(false);
    const [showAlertForSizes, setShowAlertForSizes] = useState(false);

    // Reset filters when category changes
    useEffect(() => {
        if (previousCategory.current !== category) {
            // Reset to only valid category types for the new category
            const validTypes = filters.categoryTypes.filter(type => categoryTypeList.includes(type));
            
            if (validTypes.length === 0 && categoryTypeList.length > 0) {
                // If no valid types remain, set to first available type
                dispatch(updateCategoryTypes(categoryTypeList[0]));
            } else if (validTypes.length !== filters.categoryTypes.length) {
                // If some invalid types were removed, update with valid ones
                dispatch(updateCategoryTypes(validTypes[0]));
            }

            setShowAlertForCategoryTypes(false);
            setShowAlertForSizes(false);
            previousCategory.current = category;
        }
    }, [category, categoryTypeList, dispatch]);

    const handleCategoryTypesOnChange = (type) => {
        if (filters.categoryTypes.length === 1 && filters.categoryTypes.includes(type)) {
            setShowAlertForCategoryTypes(true);
        } else {
            setShowAlertForCategoryTypes(false);
            dispatch(updateCategoryTypes(type));
        }
    }

    const handleSizesOnChange = (size) => {
        if (filters.sizes.length === 1 && filters.sizes.includes(size)) {
            setShowAlertForSizes(true);
        } else {
            setShowAlertForSizes(false);
            dispatch(updateSizes(size));
        }
    }

    // Handle navigation with debouncing
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
        }

        navigationTimeoutRef.current = setTimeout(() => {
            // Ensure only valid category types are included
            const validCategoryTypes = filters.categoryTypes.filter(type => categoryTypeList.includes(type));
            
            if (validCategoryTypes.length === 0 && categoryTypeList.length > 0) {
                dispatch(updateCategoryTypes(categoryTypeList[0]));
                return;
            }

            const queryString = fitlersToStringParams({ 
                category, 
                filters: { 
                    ...filters, 
                    categoryTypes: validCategoryTypes 
                } 
            });
            navigate(`/category/${category}?${queryString}`);
        }, 300);

        return () => {
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, [filters.categoryTypes, filters.sizes, filters.minPrice, filters.maxPrice, filters.sortBy, category]);

    return (
        <>
            {/* desktop version */}
            {!isMobile && <div className="hidden sm:block my-6 mx-6">
                {/* category types*/}
                <h1 className="text-md font-normal mb-3">{isEnglish ? "Category Types" : "類別"}</h1>

                <div className="flex flex-col ml-0.5">
                    {categoryTypeList.map((type) => {
                        return (
                            <label for={type} className="flex items-center gap-2.5 cursor-pointer mt-0.5">
                                <CustomBottomCategroy value={type} color={"black"}
                                    isChecked={filters.categoryTypes.includes(type) ? true : false}
                                    onChange={() => handleCategoryTypesOnChange(type)} />
                                <div className=" text-gray-600 captialize cursor-pointer">
                                    {isEnglish ? type : categoryTypeChinese[type]}
                                </div>
                            </label>
                        )
                    })}

                </div>

                {showAlertForCategoryTypes &&
                    <div className="text-gray-800 text-sm font-bold mt-4 flex flex-rows items-center">
                        <div className="pr-2.5 ">
                            <WarningIcon />
                        </div>
                        <div>
                            {isEnglish ? "At least one category type must be selected." : "至少選擇一個分類"}
                        </div>
                    </div>}

                {/* price */}
                <div className="my-10 mt-12">
                    <PriceSlider category={category} filters={filters} isEnglish={isEnglish} />
                </div>

                {/* sizes */}
                <h1 className="text-md font-normal mb-3 mt-12">{isEnglish ? "Sizes" : "尺寸"}</h1>

                <div className="flex flex-col ml-0.5">
                    {sizeList.map((size) => {
                        return (
                            <label for={size} className="flex items-center gap-2.5 cursor-pointer mt-0.5">
                                <CustomBottomCategroy value={size} color={"black"}
                                    isChecked={filters.sizes.includes(size) ? true : false}
                                    onChange={() => handleSizesOnChange(size)} />
                                <div className=" text-gray-600 captialize cursor-pointer">
                                    {size}
                                </div>
                            </label>
                        )
                    })}
                </div>

                {showAlertForSizes &&
                    <div className="text-gray-800 text-sm font-bold mt-4 flex flex-rows items-center">
                        <div className="pr-2.5 ">
                            <WarningIcon />
                        </div>
                        <div>
                            {isEnglish ? "At least one size must be selected." : "至少選擇一個尺寸"}
                        </div>
                    </div>}
            </div>}

            {/* mobile version */}
            {isMobile && <div className="sm:hidden">
                
                {/* category */}
                <div className="mx-7 rounded-t-lg grid grid-cols-3 overflow-hidden  border-gray-300 drop-shadow-sm">
                    {categoryList.map((currCategory, index) => {
                        return (
                            <div 
                                key={index} 
                                className={`text-center py-2 text-base
                                ${category.toLowerCase() === currCategory.toLowerCase()? 
                                "border-thirdPrimary bg-gray-800 text-white drop-shadow-lg" : "text-gray-600 bg-gray-100"}`}
                                onClick={() => navigate(`/category/${currCategory}`)}
                                >
                                    
                                {isEnglish ? currCategory : categoryChinese[currCategory.toUpperCase()]}
                            </div>
                        )

                    })}
                </div>

                <div className="border border-gray-200  border2 mx-7 pt-1 pb-2 px-4 rounded-b-xl ">

                    {/* category types*/}
                    <div className="flex flex-col mt-1">

                        <div className="text-sm font-normal ">{isEnglish ? "Category Types" : "類別"}</div>

                        <div className="flex flex-cols gap-1 mt-1">
                            {categoryTypeList.map((type) => {
                                return (
                                    <div className="grid-cols-4 w-full">
                                        <label for={type} className="flex items-center text-sm cursor-pointer">
                                            <CustomBottomCategroy value={type} color={"gray"}
                                                isChecked={filters.categoryTypes.includes(type) ? true : false}
                                                onChange={() => handleCategoryTypesOnChange(type)}
                                            />
                                            <div className=" text-gray-600 captialize cursor-pointer ml-1">
                                                {isEnglish ? type : categoryTypeChinese[type]}
                                            </div>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="py-[1px] bg-gray-200 "></div>

                    {/* sizes */}
                    <div className="flex flex-col mt-1">
                        <div className="text-sm font-normal">{isEnglish ? "Sizes" : "尺寸"}</div>

                        <div className="flex flex-cols gap-3 mt-1">
                            {sizeList.map((size) => {
                                return (
                                    <div className="grid-cols-4 w-full">
                                        <label for={size} className="flex items-center text-sm cursor-pointer">
                                            <CustomBottomCategroy value={size} color={"gray"}
                                                isChecked={filters.sizes.includes(size) ? true : false}
                                                onChange={() => handleSizesOnChange(size)} />
                                            <div className=" text-gray-600 captialize cursor-pointer ml-1 pl-1 pr-4">
                                                {size}
                                            </div>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="py-[1px] bg-gray-200"></div>

                    <div className="flex flex-col mt-1">
                        <div className="text-sm font-normal basis-1/5"><span>{isEnglish ? "Price" : "價格"}</span></div>
                        <div className=" pl-1"><PriceSlider category={category} filters={filters} isEnglish={isEnglish} /></div>
                    </div>
                </div>
            </div>}
        </>
    )
}