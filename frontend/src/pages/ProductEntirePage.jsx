import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { ProductPage } from "./ProductPage"

export const ProductEntirePage = () => {
    return (
        <div className="font-inter">
            <EntireHeader needSearchBar={false} needCategory={false} needPromotionBar={true}/>
            <ProductPage />
            <EntireFooter />
        </div>
    )
}