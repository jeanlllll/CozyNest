import { PriceSlider } from "./PriceSlider"
import { CustomButton } from "../CustomButton"
import { updateCategoryTypes, updateSizes } from "../../store/features/filtersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { fitlersToStringParams } from "../../Helper/filtersToStringParams";
import { useState } from "react";
import { WarningIcon } from "../../assets/icons/WarningIcon";

export const FilterSideBar = ({ categoryTypeList, sizeList, category }) => {

    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters)
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);

    const handleCategoryTypesOnChange = (type) => {
        if (filters.categoryTypes.length === 1 && filters.categoryTypes.includes(type)) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
            dispatch(updateCategoryTypes(type));
        }
    }

    const handleSizesOnChange = (size) => {
        dispatch(updateSizes(size));
    }

    useEffect(() => {
        setShowAlert(false);
    }, [category])

    useEffect(() => {
        const queryString = fitlersToStringParams({ category, filters });
        navigate(`/category/${category}?${queryString}`);
    }, [filters.categoryTypes, filters.sizes]);

    return (
        <div className="my-6 mx-6">
            {/* category types*/}
            <h1 className="text-md font-normal mb-3">Category Types</h1>

            <div className="flex flex-col ml-0.5">
                {categoryTypeList.map((type) => {
                    return (
                        <label for={type} className="flex items-center gap-2.5 cursor-pointer mt-0.5">
                            <CustomButton value={type}
                                isChecked={filters.categoryTypes.includes(type) ? true : false}
                                onChange={() => handleCategoryTypesOnChange(type)} />
                            <div className=" text-gray-600 captialize cursor-pointer">
                                {type}
                            </div>
                        </label>
                    )
                })}

            </div>
            {showAlert &&
                <div className="text-gray-800 text-sm font-bold mt-4 flex flex-rows items-center">
                    <div className="pr-2.5 ">
                        <WarningIcon />
                    </div>
                    <div>
                        At least one category type must be selected.
                    </div>
                </div>}

            {/* price */}
            <div className="my-10 mt-12">
                <PriceSlider category={category} filters={filters} />
            </div>

            {/* sizes */}
            <h1 className="text-md font-normal mb-3 mt-12">Sizes</h1>

            <div className="flex flex-col ml-0.5">
                {sizeList.map((size) => {
                    return (
                        <label for={size} className="flex items-center gap-2.5 cursor-pointer mt-0.5">
                            <CustomButton value={size}
                                isChecked={filters.sizes.includes(size) ? true : false}
                                onChange={() => handleSizesOnChange(size)} />
                            <div className=" text-gray-600 captialize cursor-pointer">
                                {size}
                            </div>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}