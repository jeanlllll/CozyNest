import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { CartPage } from "../components/cart/CartPage"

export const CartEntirePage = () => {
    return (
        <div className="font-inter">
            <div className="relative z-20">
                <EntireHeader needSearchBar={false} needCategory={true} />
            </div>
            <div className="relative z-10">
                <CartPage />
            </div>
            <div>
                <EntireFooter />
            </div>
        </div>
    )
}