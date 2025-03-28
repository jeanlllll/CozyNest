import { Bar3Icon } from "../../assets/icons/Bar3Icon"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { switchToTraditionalChinese, switchToEnglish } from "../../store/features/languageSlice";
import { categoryList } from "../../assets/data/data";
import { categoryChinese } from "../../assets/data/data";

export const Menus = ({ show, needCategory, category }) => {

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const language = useSelector((state) => state.language.language);
    const [isEnglish, setIsEnglish] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsEnglish(language === 'en');
    }, [language]);

    const toggleMenu = () => {
        setOpen((prev) => !prev)
    };

    const handleSwitchLanguageEvent = (e) => {
        e.preventDefault();
        if (language != 'en') {
            dispatch(switchToEnglish());
        } else {
            dispatch(switchToTraditionalChinese());
        }
        setOpen(false);
    }

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="text-white text-extraBold bg-black font-medium rounded-lg text-sm px-2.5 py-2 inline-flex items-end cursor-pointer hover:bg-gray-700">
                <Bar3Icon />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 z-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44">

                    {needCategory && <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                        <li className="px-4 py-1 font-semiBold">{isEnglish ? "Products By Category" : "產品分類"}</li>
                        {categoryList.map((currCategory, index) => {
                            return (
                                <li key={index}>
                                    <div onClick={
                                        () => {
                                            navigate(`/category/${currCategory.toLowerCase()}`);
                                            setOpen(false);
                                        }}
                                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer}">
                                        {isEnglish ? `${currCategory}` : `${categoryChinese[currCategory.toUpperCase()]}`}
                                    </div>
                                </li>
                            )      
                        })}
                    </ul>}
                    

                    <div class="py-2">
                        <div onClick={handleSwitchLanguageEvent}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            {isEnglish ? "切換至繁體中文" : "Switch To English"}
                        </div>
                    </div>

                    <div class="py-2">
                        <div onClick={() => navigate("/user/login")}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            {isEnglish ? "Sign In" : "登入"}
                        </div>
                    </div>
                </div>)}
        </div>
    )
}
