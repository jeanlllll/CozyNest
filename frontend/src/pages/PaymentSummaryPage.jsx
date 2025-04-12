import { useLoaderData, useNavigate } from "react-router"
import { EntireFooter } from "../components/footer/EntireFooter"
import { EntireHeader } from "../components/header/EntireHeader"
import { StatusBar } from "../components/cart/StatusBar"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { usePageMeta } from "../components/usePageMeta"

export const PaymentSummaryPage = () => {
    const data = useLoaderData();
    const navigate = useNavigate();

    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en"

    usePageMeta({titleEn: "Payment Summary", titleZh: "付款總結", isEnglish: isEnglish })

    return (
        <div className="min-h-screen flex flex-col font-inter">
            <div><EntireHeader needSearchBar={false} needPromotionBar={false} /></div>

            <div className="flex-1 flex justify-center px-6">
                <div className="container">
                    <h1 className="font-bold text-2xl sm:text-3xl mt-6 sm:mt-12">
                        {isEnglish ? "Shopping Cart" : "購物車"}
                    </h1>
                    <div className="mt-6 sm:mt-12">
                        <StatusBar status={"paymentSummary"} />
                    </div>

                    <div className="border border-gray-300 mt-8 sm:mt-20 px-4 sm:px-8 md:px-20 lg:px-40 
                        flex flex-col justify-center items-center rounded-lg shadow-md py-6 sm:py-10">

                        {data.paymentStatus === "SUCCESS" && 
                        <div className="flex flex-col justify-center items-center text-center">
                            <div className="text-black text-2xl sm:text-4xl font-bold mb-6 sm:mb-12">
                                {isEnglish ? "Payment Success" : "付款成功"}
                            </div>
                            <div className="text-base sm:text-xl px-2 sm:px-4">
                                {isEnglish 
                                    ? `Thank you for your order. Your order #${data.orderId} will be processed within 24 hours during working day. We will notify you by email once your order has been shipped.`
                                    : `感謝您的訂購。您的訂單 #${data.orderId} 將在工作日24小時內處理。訂單發貨後我們會通過電子郵件通知您。`
                                }
                            </div>
                        </div>}

                        {(data.paymentStatus === "FAILURE" || data.paymentStatus === "EXPIRE" || data.paymentStatus === "Refund") && 
                        <div className="flex flex-col justify-center items-center text-center">
                            <div className="text-black text-2xl sm:text-4xl font-bold mb-6 sm:mb-10">
                                {isEnglish ? "Payment Failed" : "付款失敗"}
                            </div>
                            <div className="text-base sm:text-2xl px-2 sm:px-4">
                                {isEnglish 
                                    ? <>We're sorry, your payment for order <strong>#{data.orderId}</strong> was not successful. Please try again or contact our customer support if the issue persists.</>
                                    : <>很抱歉，您的訂單 <strong>#{data.orderId}</strong> 付款未成功。請重試或如果問題持續存在請聯繫我們的客戶支援。</>
                                }
                            </div>
                        </div>}

                        <div className="flex flex-col sm:flex-row w-full mt-8 sm:mt-18 gap-4 sm:gap-6 px-4 sm:px-0">
                            <button 
                                className="w-full sm:w-1/2 bg-buttonMain text-white rounded-md flex items-center justify-center 
                                py-3 sm:py-2 text-base sm:text-xl hover:bg-gray-800 transition-colors duration-200"
                                onClick={() => navigate(`/user/order/${data.orderId}`)}
                            >
                                {isEnglish ? "View Your Order" : "查看訂單"}
                            </button>
                            <button 
                                className="w-full sm:w-1/2 bg-buttonMain text-white rounded-md flex items-center justify-center 
                                py-3 sm:py-2 text-base sm:text-xl hover:bg-gray-800 transition-colors duration-200"
                                onClick={() => navigate("/")}    
                            >
                                {isEnglish ? "Return To Home Page" : "返回首頁"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 sm:mt-17"><EntireFooter /></div>

            <div className="z-50">
                <div className="md:hidden"><WindowScrollToTopButton /></div>
                <div className="relative z-30">
                    <AIAgentButton />
                </div>
            </div>
        </div>
    )
}
