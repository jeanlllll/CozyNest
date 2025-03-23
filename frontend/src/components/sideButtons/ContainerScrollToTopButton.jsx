import { ScrollUpIcon } from "../../assets/icons/ScrollUpIcon";
import { useState, useEffect } from "react";

export const ContainerScrollToTopButton = ({ scrollRef }) => {
    const [visible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollRef.current;

        const toggleVisibility = () => {
            setIsVisible(scrollContainer.scrollTop > 300);
        }

        scrollContainer.addEventListener("scroll", toggleVisibility);
        return () => scrollContainer.removeEventListener("scroll", toggleVisibility);
    }, [])

    const handleScrollToTopEvent = () => {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth"})
    }

    return (
        visible && (
            <button onClick={handleScrollToTopEvent} className="fixed right-5 bottom-28 p-[10px] mr-22 mb-5 bg-thirdPrimary rounded-full cursor-pointer drop-shadow-lg">
                <ScrollUpIcon />
            </button>
        )
    )
}