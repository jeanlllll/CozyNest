import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { CartPage } from "../components/cart/CartPage"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"
import { useSelector } from "react-redux"
import { usePageMeta } from "../components/usePageMeta"

export const CartEntirePage = () => {
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en"

    usePageMeta({titleEn: "Cart", titleZh: "購物車", isEnglish: isEnglish })

    return (
        <div className="min-h-dvh font-inter flex flex-col">
            <div className="relative z-20">
                <EntireHeader needSearchBar={false} needCategory={true} needPromotionBar={true}/>
            </div>

            <div className="relative z-10 flex-grow">
                <CartPage isEnglish={isEnglish}/>
            </div>
            <div className="">
                <EntireFooter />
            </div>

            <div className="z-50">
                <div className="md:hideen"><WindowScrollToTopButton /></div>
                <div className="relative z-30">
                    <AIAgentButton />
                </div>
            </div>
        </div>
    )
}