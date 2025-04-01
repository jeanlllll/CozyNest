import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setGenderSelected } from "../../store/features/productPageSlice";
import { genderChinese } from "../../assets/data/data";
import { resetSizeNProductVariantIdSelected } from "../../store/features/productPageSlice";

export const GenderSelector = ({isEnglish}) => {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen(!open);
    };

    const dispatch = useDispatch();

    const gender = useSelector((state) => state.productPageGlobalState.genderSelected);

    const hanldeGenderSelected= (selectGender) => {
        if (gender !== selectGender) {
            dispatch(setGenderSelected(selectGender));
            setOpen(false);
            dispatch(resetSizeNProductVariantIdSelected())
        }
    }

    
    return (
        <div className="relative inline-block">
            <button
                onClick={toggleDropdown}
                className="text-white bg-gray-800 focus:ring-4 focus:outline-none 
             font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center cursor-pointer mr-4 w-26 justify-center"
            >   
                {gender !== ""? (isEnglish? gender : genderChinese[gender]) : isEnglish? "Gender" : "性別"}

                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 z-10 mt-2 text-center items-center justify-center bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-27 drop-shadow-lg">
                    <ul className="py-2 text-sm text-gray-700">
                        <li>
                            <div onClick={() => hanldeGenderSelected("F")}
                                className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer 
                                ${gender === "F" ? "text-black font-bold" : "font-normal"}`}>
                                {isEnglish ? "F" : "女"}
                            </div>
                        </li>
                        <li>
                            <div onClick={() => hanldeGenderSelected("M")}
                                className={`block px-4 py-2 hover:bg-gray-100 cursor-pointer 
                                ${gender === "M" ? "text-black font-bold" : "font-normal"}`}>
                                {isEnglish ? "M" : "男"}
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
