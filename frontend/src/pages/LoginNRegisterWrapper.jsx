import { EntireHeader } from "../components/header/EntireHeader"
import { LanguageLoginHeader } from "../components/header/LanguageLoginHeader"
import { Navigation } from "../components/header/Navigation"
import LanguageSwitcher from "../components/header/LanguageSwitcher"
import { Menus } from "../components/header/Menus"
import { RightReservedFooter } from "../components/footer/RightReservedFooter"
import { Outlet } from "react-router"
import { useSelector } from "react-redux"
import { useLocation } from "react-router"
import { useNavigate } from "react-router-dom";

export const LoginNRegisterWrapper = () => {
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === 'en';

    const location = useLocation();
    const isLogin = location.pathname.includes("/login");

    const navigate = useNavigate();

    return (
        <div className="lg:h-dvh flex flex-col">
            <div className="hidden md:block container mx-auto" >
                <div className="flex justify-end py-0.5 mr-3 text-xs text-black">
                    <span className="mr-3 sm:mr-4 cursor-pointer"><LanguageSwitcher /></span>
                    {/* {location.path} */}

                    {isLogin && (<button className="cursor-pointer" onClick={() => navigate("/user/register")}>
                        {language === 'en' ? 'Register' : '註冊'}
                    </button>)}

                    {!isLogin && (<button className="cursor-pointer" onClick={() => navigate("/user/login")}>
                        {language === 'en' ? 'Login' : '登入'}
                    </button>)}
                </div>
            </div>

            <div className="bg-secondPrimary py-3 px-2 drop-shadow-lg">
                <div className="flex container mx-auto justify-between">
                    <div className="font-protest text-4xl font-bold text-white w-1/2 md:w-1/3 cursor-pointer" onClick={()=> navigate("/")}>
                    CozyNest</div>
                    <div className="sm:hidden flex flex-row">
                        <div className="flex items-center">
                            <Menus />
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />

            <div className="mt-auto">
                <RightReservedFooter />
            </div>
        </div >
    )
}
