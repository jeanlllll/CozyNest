import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { ProductPage } from "./ProductPage"


export const ProductEntirePage = () => {

    return (
        <div className="font-inter relative">
            <div className="relative z-20"><EntireHeader needCategory={true} needPromotionBar={true} /></div>
            <div className="relative z-10 mb-25"><ProductPage /></div>
            <EntireFooter />
        </div>
    )
}