import { ScrollUpIcon } from "../../assets/icons/ScrollUpIcon";
import { useState, useEffect } from "react";

export const WindowScrollToTopButton = () => {
    const [visible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        }

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [])

    const handleScrollToTopEvent = () => {
        window.scrollTo({ top: 0, behavior: "smooth"})
    }

    return (
        visible && (
            <button onClick={handleScrollToTopEvent} 
                className="fixed bottom-19 right-1 p-3 mb-3 mr-3 lg:right-5 lg:bottom-28 lg:p-[10px] lg:mr-22 lg:mb-5
                        bg-thirdPrimary rounded-full cursor-pointer drop-shadow-lg">
                <ScrollUpIcon />
            </button>
        )
    )
}