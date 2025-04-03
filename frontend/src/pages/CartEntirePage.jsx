import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { CartPage } from "../components/cart/CartPage"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"

export const CartEntirePage = () => {
    return (
        <div className="font-inter">
            <div className="relative z-20">
                <EntireHeader needSearchBar={false} needCategory={true} needPromotionBar={true}/>
            </div>
            <div className="relative z-10">
                <CartPage />
            </div>
            <div>
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