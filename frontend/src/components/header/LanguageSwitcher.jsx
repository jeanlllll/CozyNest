import { useDispatch } from "react-redux"
import { switchToEnglish, switchToTraditionalChinese } from "../../store/features/languageSlice";
import { useSelector } from "react-redux";

const LanguageSwitcher = () => {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.language.language);

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

    return (
        <>
            <div><span
                onClick={switchLanguageToEn}
                className={language === 'en' ? 'font-semibold' : 'text-gray-700'}>
                English</span>
                <span> / </span>
                <span
                    onClick={switchLanguageToTraditionalChinese}
                    className={language === 'zh-hk' ? 'font-extrabold' : 'text-gray-700'}>
                    中文
                </span>
            </div>
        </>
    )
}

export default LanguageSwitcher;