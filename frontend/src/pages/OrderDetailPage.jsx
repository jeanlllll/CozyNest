import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { useLoaderData } from "react-router"
import { OrderProductDtoList } from "../components/orderDetail/orderProductList"
import { useSelector } from "react-redux"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"
import { usePageMeta } from "../components/usePageMeta"
import { useNavigate } from "react-router"

export const OrderDetailPage = () => {

    const data = useLoaderData();
    const language = useSelector((state) => state.language.language)
    const isEnglish = language === "en";
    const navigate = useNavigate();

    usePageMeta({titleEn: "Order", titleZh: "訂單摘要", isEnglish: isEnglish })

    return (
        <div className="min-h-screen flex flex-col font-inter">
            <div className="relative z-20">
                <EntireHeader />
            </div>

            <div className="flex-1 w-full bg-gray-50">
                <div className="container mx-auto px-4 py-6 sm:py-10">
                    <div className="max-w-8xl mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-8">
                        {/* Order Header */}
                        <h1 className="text-2xl sm:text-4xl font-bold text-buttonMain mb-6">
                            {isEnglish ? "Order" : "訂單"} #{data.orderId}
                        </h1>

                        {/* Order Status Section */}
                        <div className="space-y-2 text-base sm:text-lg mb-6">
                            <div>
                                <span className="font-medium">{isEnglish ? "Order Status: " : "訂單狀態："}</span>
                                {data.orderStatus.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </div>
                            <div>
                                <span className="font-medium">{isEnglish ? "Order Date: " : "訂單日期："}</span>
                                {data.orderDate}
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="space-y-2 text-base sm:text-lg mb-6">
                            <h2 className="font-semibold">{isEnglish ? "Payment" : "付款"}</h2>
                            <div>
                                <span className="font-medium">{isEnglish ? "Payment Status: " : "付款狀態："}</span>
                                {data.paymentStatus.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </div>
                            <div>
                                <span className="font-medium">{isEnglish ? "Payment Date: " : "付款日期："}</span>
                                {data.paymentDate}
                            </div>
                        </div>

                        {/* Delivery Section */}
                        {data.paymentStatus === "SUCCESS" && (
                            <div className="space-y-2 text-base sm:text-lg mb-6">
                                <h2 className="font-semibold">{isEnglish ? "Delivery" : "送貨"}</h2>
                                <div>
                                    <span className="font-medium">{isEnglish ? "Tracking Number: " : "追蹤編號："}</span>
                                    {data.trackingNumber === null ? (isEnglish ? "Product Not Yet Shipped" : "產品尚未發貨") : data.trackingNumber}
                                </div>
                                <div>
                                    <span className="font-medium">{isEnglish ? "Shipping Date: " : "發貨日期："}</span>
                                    {data.shippingDate === null ? (isEnglish ? "Product Not Yet Shipped" : "產品尚未發貨") : data.shippingDate}
                                </div>
                            </div>
                        )}

                        {/* Order Products */}
                        <div className="mb-8">
                            <OrderProductDtoList orderProductDtoList={data.orderProductDtoList} isEnglish={isEnglish} />
                        </div>

                        {/* Shipping and Payment Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-b border-gray-200 py-6 sm:py-8 mb-8">
                            {/* Shipping Address */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg">{isEnglish ? "Shipping Address" : "送貨地址"}</h3>
                                <div>{data.receiver}</div>
                                <div>{data.shippingAddress}</div>
                                <div>{data.phoneNumber}</div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg">{isEnglish ? "Payment Method" : "付款方式"}</h3>
                                <div>
                                    {data.paymentMethod === null 
                                        ? (isEnglish ? "Not yet paid" : "尚未付款")
                                        : data.paymentMethod.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </div>
                            </div>

                            {/* Shipping Method */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg">{isEnglish ? "Shipping Method" : "送貨方式"}</h3>
                                <div>
                                    {data.shippingMethod.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
                                    {isEnglish ? " Shipping" : " 運送"}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {data.shippingMethod === "STANDARD" 
                                        ? (isEnglish ? "Takes Up to 3-10 days" : "需時3-10天")
                                        : (isEnglish ? "Takes Up to 2-4 days" : "需時2-4天")}
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-end font-bold mb-4">HKD</div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>{isEnglish ? "Original Price" : "原價"}</span>
                                    <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(data.originalPrice)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{isEnglish ? "Promotion Discount" : "促銷折扣"}</span>
                                    <span>- {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(data.promotionPrice)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{isEnglish ? "Discount Code" : "折扣碼"}</span>
                                    <span>{data.discountPrice}</span>
                                </div>
                                <div className="text-sm text-gray-500 italic">
                                    {data.discountCodeUsed === null 
                                        ? (isEnglish ? "No Discount Code applied" : "未使用折扣碼")
                                        : data.discountCodeUsed}
                                </div>

                                <div className="flex justify-between">
                                    <span>{isEnglish ? "Transportae" : "運費"}</span>
                                    <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(data.transportationPrice)}</span>
                                </div>

                                <div className="flex justify-between border-t border-gray-600 pt-4 font-bold">
                                    <span>{isEnglish ? "Total" : "總計"}</span>
                                    <span>{data.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Return Button */}
                        <div className="flex justify-center">
                            <button 
                                onClick={() => navigate(-1)}
                                className="bg-buttonMain text-white px-6 sm:px-10 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-colors text-lg sm:text-xl cursor-pointer"
                            >
                                {isEnglish ? "Return To Previous Page" : "返回上一頁"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <EntireFooter />
            </div>

            <div className="fixed bottom-4 right-4 z-50 space-y-4">
                <WindowScrollToTopButton />
                <AIAgentButton />
            </div>
        </div>
    )
}

