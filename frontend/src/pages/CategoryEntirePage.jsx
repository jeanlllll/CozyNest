import { CategoryPage } from "./CategoryPage"
import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"

export const CategoryEntirePage = (request) => {
    return (
        <div className="font-inter">
            <div className="relative z-20">
                <EntireHeader needSearchBar={false} needCategory={true}/>
            </div>
            <div className="relative z-10">
                <CategoryPage request={request}/>
            </div>
            <div>
                <EntireFooter />
            </div>
        </div>

    )

}