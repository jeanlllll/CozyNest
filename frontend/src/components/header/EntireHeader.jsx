import { LanguageLoginHeader } from "./LanguageLoginHeader"
import { Navigation } from "./Navigation"
import { PromotionBar } from "./PromotionBar"

export const EntireHeader = ({needCategory, needPromotionBar}) => {
    return (
        <>
            {/* Desktop Header */}
            <div className="hidden sm:block sm:w-full">
                <LanguageLoginHeader />
                <Navigation needCategory={needCategory}/>
                {needPromotionBar && <PromotionBar/>}
            </div>

            {/* Mobile Header */}
            <div className="block sm:hidden sm:w-full">
                <PromotionBar />
                <Navigation needCategory={needCategory}/>
            </div>
        </>

    )

}