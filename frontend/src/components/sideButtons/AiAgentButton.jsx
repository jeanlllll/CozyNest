import { CustomerServiceIcon } from "../../assets/icons/CustomerServiceIcon"

export const AIAgentButton = () => {
    return (
        <button className="fixed bottom-4 right-1 p-3 mb-3 mr-3
                                 lg:p-[10px] lg:mr-22 lg:mb-6 lg:right-5 lg:bottom-4  
                               bg-thirdPrimary rounded-full cursor-pointer drop-shadow-lg">
            <CustomerServiceIcon />
        </button>
    )
}