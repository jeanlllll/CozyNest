import { useLoaderData, useNavigate } from "react-router"
import { EntireFooter } from "../components/footer/EntireFooter"
import { EntireHeader } from "../components/header/EntireHeader"
import { useState } from "react"
import { SideColumns } from "../components/profile/SideColumns"
import { PaginationCompo } from "../components/PaginationCompo"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { usePageMeta } from "../components/usePageMeta"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"

export const OrderPage = () => {

    const language = useSelector((state) => state.language.language)
    const isEnglish = language === "en";

    usePageMeta({ titleEn: "Order Summary", titleZh: "訂單總覽", isEnglish: isEnglish });

    const ITEMS_PER_PAGE = 10;

    const data = useLoaderData();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const paginatedOrder = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const totalPage = Math.ceil(data.length / ITEMS_PER_PAGE)

    const handlePageChange = (event, pageValue) => {
        setCurrentPage(pageValue - 1);
    }

    return (
        <div className="min-h-screen flex flex-col font-inter overflow-visible z-10">
            <div><EntireHeader needPromotionBar={true} /></div>

            <div className="w-full flex justify-center">
                <div className="container flex flex-col sm:flex-row mt-6 sm:mt-10 sm:mb-6">
                    <div className="px-4 sm:mt-24 sm:ml-10 flex justify-center sm:justify-none mb-4 sm:mb-0">
                        <SideColumns type="order" isEnglish={isEnglish} />
                    </div>

                    <div className="px-7 sm:px-0 sm:ml-47 sm:basis-3/5 mb-4 sm:mb-2 pt-2 sm:pt-8">
                        <div className="flex flex-row justify-between items-center">
                            <div className="text-2xl sm:text-3xl text-buttonMain font-bold">
                                {isEnglish ? "My Orders" : "我的訂單"}
                            </div>
                        </div>

                        {data && data.length > 0 ? (
                            <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
                                {data.map((order) => (
                                    <div key={order.orderId}
                                        className="border border-gray-300 rounded-lg p-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        <div className="flex-1">
                                            <div className="text-lg sm:text-xl font-semibold mb-2">
                                                {isEnglish ? `Order #${order.orderId}` : `訂單 #${order.orderId}`}
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="text-sm sm:text-base text-gray-600">
                                                    {isEnglish ? "Order Date" : "訂單日期"}: {order.orderDate}
                                                </div>

                                                <div className="text-sm sm:text-base text-gray-600">
                                                    {isEnglish ? "Order Status: " : "訂單狀態: "}
                                                    <span className="font-semibold text-gray-900">
                                                        {order.orderStatus.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                </div>

                                                <div className="text-sm sm:text-base text-gray-600">
                                                    {isEnglish ? "Payment Status: " : "付款狀態: "}
                                                    <span className="font-medium">
                                                        {order.paymentStatus.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                </div>

                                                <div className="text-sm sm:text-base text-gray-600">
                                                    {isEnglish ? "Payment Date" : "付款日期"}: {order.paymentDate}
                                                </div>

                                                <div className="text-base sm:text-lg font-medium mt-2">
                                                    {isEnglish ? "Total" : "總金額"}: ${order.totalPrice}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex sm:items-start">
                                            <button
                                                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-buttonMain text-white rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base cursor-pointer"
                                                onClick={() => navigate(`/user/order/${order.orderId}`)}
                                            >
                                                {isEnglish ? "View Details" : "查看詳情"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-lg sm:text-xl text-gray-500 text-center sm:text-left mt-4">
                                {isEnglish ? "No orders found" : "尚未有任何訂單"}
                            </div>
                        )}

                        {data && data.length > 0 && (
                            <div className="flex justify-center mt-6 sm:mt-15">
                                <PaginationCompo
                                    totalPage={totalPage}
                                    currentPage={currentPage - 1}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto"><EntireFooter /></div>

            <div className="relative z-30">
                <WindowScrollToTopButton />
                <AIAgentButton />
            </div>
        </div>
    )
}