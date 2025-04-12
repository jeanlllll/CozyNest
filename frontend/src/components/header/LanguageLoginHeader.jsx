import { useSelector } from "react-redux"
import LanguageSwitcher from "./LanguageSwitcher"
import { useNavigate } from "react-router-dom";
import { postLogooutRequest } from "../../api/postLogoutRequest";
import { setIsLogin } from "../../store/features/authSlice";
import { useDispatch } from "react-redux";

export const LanguageLoginHeader = () => {
    const language = useSelector((state) => state.language.language);
    const navigate = useNavigate();
    const isLogin = useSelector((state) => state.auth.isLogin)
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const response = await postLogooutRequest();
        if (response.status === 200) {
            localStorage.clear();
            dispatch(setIsLogin(false));
            alert("Logout successfully.");
            navigate("/");
        } else {
            alert("Logout faild.");
        } 
    }

    return (
        <div className="container mx-auto">

            <div className="flex justify-end sm:py-0.5 text-xs text-black">
                <span className="mr-3 sm:mr-4 cursor-pointer"><LanguageSwitcher/></span>
                {!isLogin && <button className="cursor-pointer" onClick={() => navigate("/user/login")}>
                    {language === 'en'? 'Login' : '登入'}
                </button>}
                {isLogin && <button className="cursor-pointer" onClick={() => handleLogout()}>
                    {language === 'en'? 'Logout' : '登出'}
                </button>}
            </div>

        </div >
    )
}



