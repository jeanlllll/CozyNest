import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export const PromotionBar = () => {

    const language = useSelector((state) => state.language.language);
    const [isEnglish, setIsEnglish] = useState(true);

    useEffect(() => {
        setIsEnglish(language === 'en');
    }, [language]);

    return (
        <div className="flex justify-center py-0.5 sm:py-1
        bg-white sm:bg-primary 
        font-inter italic sm:font-inter-blackItalic font-bold 
        text-xs sm:text-sm 
        text-black
        sm:drop-shadow-lg sm:broder sm:border-thirdPrimary">

            <div>
                <div className="flex whitespace-nowrap animate-scrollX">
                    <span className="pr-10">
                        {isEnglish? 
                            "Summer Promotion: Buy 3 Items, Get 10% Off!" 
                            : "夏季促銷：買滿三件即享九折優惠！"
                        }
                    </span>

                </div>
            </div>


        </div>
    )
}