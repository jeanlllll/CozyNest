import { useLoaderData, useNavigate } from "react-router"
import { EntireFooter } from "../components/footer/EntireFooter"
import { EntireHeader } from "../components/header/EntireHeader"
import { StatusBar } from "../components/cart/StatusBar"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"

export const PaymentSummaryPage = () => {

    const data = useLoaderData();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col font-inter">
            <div><EntireHeader needSearchBar={false} needPromotionBar={false} /></div>

            <div className="flex-1 flex justify-center">
                <div className="container">
                    <h1 className="font-bold text-3xl mt-12">Shopping Cart</h1>
                    <div className="mt-12">
                        <StatusBar status={"paymentSummary"} />
                    </div>

                    <div className="border border-gray-300 mt-20 px-40 flex flex-col justify-center items-center rounded-lg drop-shadow-lg pt-10 pb-13">

                        {data.paymentStatus === "SUCCESS" && 
                        <div className="flex flex-col justify-center items-center drop-shadow-none">
                            <div className="text-black text-4xl font-bold mb-12">Payment Success</div>
                            <div className="text-xl">Thank your for your order. Your order #{data.orderId} will be processed within 24 hours during working day. We will notify you by email once your order ahs been shipped.</div>
                        </div>}

                        {(data.paymentStatus === "FAILURE" || data.paymentStatus === "EXPIRE" || data.paymentStatus === "Refund")   && 
                        <div className="flex flex-col justify-center items-center drop-shadow-none">
                            <div className="black text-4xl font-bold mb-10">Payment Failed</div>
                            <div className="text-2xl">We're sorry, your payment for order <strong>#{data.orderId}</strong> was not successful.
                            Please try again or contact our customer support if the issue persists.</div>
                        </div>}

                        <div className="flex flex-row w-full mt-18 gap-6 drop-shadow-md">
                            <div className="basis-1/2 bg-buttonMain text-white rounded-md flex items-center justify-center py-2 text-xl hover:bg-gray-800 cursor-pointer">
                                View Your Order
                            </div>
                            <div 
                                className="basis-1/2 bg-buttonMain text-white rounded-md flex items-center justify-center py-2 text-xl hover:bg-gray-800 cursor-pointer"
                                onClick={() => navigate("/")}    
                            >
                                Return To Home Page
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-17"><EntireFooter /></div>

            <div className="z-50">
                <div className="md:hideen"><WindowScrollToTopButton /></div>
                <div className="relative z-30">
                    <AIAgentButton />
                </div>
            </div>
        </div>

    )
}
