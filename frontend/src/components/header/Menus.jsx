import { Bar3Icon } from "../../assets/icons/Bar3Icon"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const Menus = () => {

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const language = useSelector((state) => state.language.language);
    const [isEnglish, setIsEnglish] = useState(false);

    useEffect(() => {
        setIsEnglish(language === 'en');
    }, [language]);

    const switchLanguageToEn = () => {
        if (language != 'en') {
            dispatch(switchToEnglish());
        }
    }

    const switchLanguageToTraditionalChinese = () => {
        if (language != 'zh-hk') {
            dispatch(switchToTraditionalChinese());
        }
    }

    const toggleMenu = () => {
        setOpen((prev) => !prev)
    };

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="text-white text-extraBold bg-black font-medium rounded-lg text-sm px-2.5 py-2 inline-flex items-end cursor-pointer hover:bg-gray-700">
                <Bar3Icon />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 z-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44">

                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                        <li className="px-4 py-1 font-semiBold">{isEnglish ? "Products By Category" : "產品分類"}</li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{isEnglish ? 'Men' : '男裝'}</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{isEnglish ? 'Women' : '女裝'}</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{isEnglish ? 'Couple' : '情侶裝'}</a>
                        </li>
                    </ul>

                    <div class="py-2">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">{isEnglish ? "切換至繁體中文" : "Switch To English"}</a>
                    </div>

                    <div class="py-2">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">{isEnglish ? "Sign In" : "登入"}</a>
                    </div>
                </div>)}
        </div>
    )
}
