import { LanguageLoginHeader } from "./LanguageLoginHeader"
import { Navigation } from "./Navigation"
import { PromotionBar } from "./PromotionBar"

export const EntireHeader = ({needSearchBar, needCategory, }) => {
    return (
        <>
            {/* Desktop Header */}
            <div className="hidden sm:block sm:w-full">
                <LanguageLoginHeader />
                <Navigation needSearchBar={needSearchBar} needCategory={needCategory}/>
                <PromotionBar/>
            </div>

            {/* Mobile Header */}
            <div className="block sm:hidden sm:w-full">
                <PromotionBar />
                <Navigation needSearchBar={needSearchBar} needCategory={needCategory}/>
            </div>
        </>

    )

}