import { EntireFooter } from "../components/footer/EntireFooter"
import { EntireHeader } from "../components/header/EntireHeader"
import { CheckoutPage } from "./CheckoutPage"

export const CheckoutEntirePage = () => {
    return (
        <div className="font-inter">
            <EntireHeader/>
            <CheckoutPage/>
            <EntireFooter/>
        </div>
    )
}