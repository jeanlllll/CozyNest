import { useSelector } from "react-redux"
import LanguageSwitcher from "./LanguageSwitcher"
import { useNavigate } from "react-router-dom";

export const LanguageLoginHeader = () => {
    const language = useSelector((state) => state.language.language);
    const navigate = useNavigate();

    return (
    
        <div className="container mx-auto">

            <div className="flex justify-end sm:py-0.5 text-xs text-black">
                <span className="mr-3 sm:mr-4 cursor-pointer"><LanguageSwitcher/></span>
                <button className="cursor-pointer" onClick={() => navigate("/user/login")}>
                    {language === 'en'? 'Login' : '登入'}
                </button>
            </div>

        </div >
    )
}



