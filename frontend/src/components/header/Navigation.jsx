import { ProfileIcon } from "../../assets/icons/ProfileIcon"
import { HeartIcon } from "../../assets/icons/HeartIcon"
import { ShoppingBagIcon } from "../../assets/icons/ShoppingBagIcon"
import { SearchBar } from "./SearchBar"
import { Menus } from "./Menus"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router"
import { resetFilters } from "../../store/features/filtersSlice"
import { useDispatch } from "react-redux"

export const Navigation = ({ needCategory }) => {
    const language = useSelector((state) => state.language.language);
    const [isEnglish, setIsEnglish] = useState(false);
    const navigate = useNavigate();
    const filters = useSelector((state) => state.filters);
    const dispatch = useDispatch();

    const { category: paramCategory } = useParams();
    const category = paramCategory?.toLowerCase();

    useEffect(() => {
        setIsEnglish(language === 'en');
    }, [language]);

    const handleCategoryOnClick = (targetCategory) => {
        navigate(`/category/${targetCategory}`);
    }

    return (
        <div className="bg-secondPrimary py-4 px-4 md:py-3 md:px-2 drop-shadow-lg">

            {/* Desktop Header */}
            <div className="hidden sm:flex container mx-auto justify-between">
                {/* Logo */}
                <div className="font-protest text-4xl font-bold text-white w-1/2 md:w-1/3 cursor-pointer" onClick={() => navigate("/")}>

                    CozyNest
                </div>

                {/* Navigation Links */}
                <div className="flex items-center justify-center font-inter text-lg font-bold text-white w-1/3 space-x-12">
                    <span className={`cursor-pointer mr-12 drop-shadow-sm hover:scale-105 ${category === "men" ? "text-black" : ""}`}
                        onClick={() => handleCategoryOnClick("men")}
                    >
                        {isEnglish ? 'Men' : '男裝'}
                    </span>
                    <span className={`cursor-pointer mr-8 drop-shadow-sm hover:scale-105 ${category === "women" ? "text-black" : ""}`}
                        onClick={() => handleCategoryOnClick("women")}
                    >
                        {isEnglish ? 'Women' : '女裝'}
                    </span>
                    <span className={`cursor-pointer drop-shadow-sm hover:scale-105 ${category === "couple" ? "text-black" : ""}`}
                        onClick={() => handleCategoryOnClick("couple")}
                    >
                        {isEnglish ? 'Couple' : '情侶裝'}
                    </span>
                </div>

                <div className="flex justify-end items-center w-1/2 md:w-1/3 space-x-12">

                    <div className="flex items-center space-x-10">

                        {/* Icons */}
                        <div className="cursor-pointer hover:scale-105"
                            onClick={() => {
                                navigate("/user/profile");
                            }}>
                            <ProfileIcon />
                        </div>
                        <div className="cursor-pointer hover:scale-105"
                            onClick={() => {
                                navigate("/user/favorite");
                            }}>
                            <HeartIcon />
                        </div>
                        <div className="cursor-pointer hover:scale-105" 
                            onClick={() => {
                            navigate("/user/cart");
                        }}>
                        <ShoppingBagIcon />
                    </div>
                </div>
            </div>
        </div>

            {/* ------------------------------------------------------------------------------------ */ }

    {/* Mobile Header */ }
    <div className="sm:hidden flex justify-between">
        <div className="font-protest justify-left text-3xl font-bold text-white drop-shadow-xl cursor-pointer"
            onClick={() => navigate("/")}
        >CozyNest</div>
        <div className="flex flex-row">
            <div className="flex items-center">
                <Menus needCategory={needCategory} category={category} />
            </div>
        </div>
    </div>
        </div >
    )
}