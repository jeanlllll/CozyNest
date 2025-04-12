import { EntireFooter } from "../components/footer/EntireFooter"
import { EntireHeader } from "../components/header/EntireHeader"
import { CheckoutPage } from "./CheckoutPage"
import { useSelector } from "react-redux"
import { usePageMeta } from "../components/usePageMeta"

export const CheckoutEntirePage = () => {

    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en"

    usePageMeta({titleEn: "Checkout", titleZh: "結帳", isEnglish: isEnglish })

    return (
        <div className="font-inter">
            <EntireHeader/>
            <CheckoutPage isEnglish={isEnglish}/>
            <EntireFooter/>
        </div>
    )
}