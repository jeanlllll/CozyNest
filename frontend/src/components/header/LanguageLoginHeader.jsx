import { useSelector } from "react-redux"
import LanguageSwitcher from "./LanguageSwitcher"


export const LanguageLoginHeader = () => {
    const language = useSelector((state) => state.language.language);

    return (
    
        <div className="container mx-auto">

            <div className="flex justify-end sm:py-0.5 text-xs text-black">
                <span className="mr-3 sm:mr-4 cursor-pointer"><LanguageSwitcher/></span>
                <span className="cursor-pointer">
                    {language === 'en'? 'Login' : '登入'}
                </span>
            </div>

        </div >
    )
}



