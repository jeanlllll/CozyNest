import { CustomerServiceIcon } from "../../assets/icons/CustomerServiceIcon"
import { useState } from "react";
import { AIChatBox } from "../AIChatBox";

export const AIAgentButton = () => {

    const [showChatBox, setShowChatBox] = useState(false);

    const handleOnClick = () => {
        return setShowChatBox(!showChatBox);
    }

    return (
        <div>
            {showChatBox && <AIChatBox onClickFunc={handleOnClick}/>}
            <button className="fixed bottom-4 right-1 p-3 mb-3 mr-3
                                 lg:p-[10px] lg:mr-22 lg:mb-6 lg:right-5 lg:bottom-4  
                               bg-thirdPrimary rounded-full cursor-pointer drop-shadow-lg"
                    onClick={() => handleOnClick()}
            >
                <CustomerServiceIcon/>
            </button>
        </div>

    )
}