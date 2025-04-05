import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { useLoaderData } from "react-router"
import { OrderProductDtoList } from "../components/orderDetail/orderProductList"
import { useSelector } from "react-redux"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"

export const OrderDetailPage = () => {
    const data = useLoaderData();
    const language = useSelector((state) => state.language.language)
    const isEnglish = language === "en";

    return (
        <div className="w-full h-full font-inter">
            <div><EntireHeader /></div>

            <div className="w-full h-full flex justify-center items-center py-15 text-xl">
                <div className="container">
                    <h1 className="text-4xl font-bold text-buttonMain">Order #{data.orderId}</h1>
                    <div className="mt-7">Order Status: {data.orderStatus.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                    <div>Order Date: {data.orderDate}</div>

                    <div className="mt-4 font-semibold">Payment</div>
                    <div >Payment Status: {data.paymentStatus.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                    <div>Payment Date: {data.paymentDate}</div>
                    {data.paymentStatus === "SUCCESS" &&
                        <div className="">
                            <div className="mt-4 font-semibold">Delivery</div>
                            <div>Tracking Number: {data.trackingNumber === null ? "Product Not Yet Shipped" : data.trackingNumber}</div>
                            <div>Shipping Date: {data.shippingDate === null ? "Product Not Yet Shipped" : data.shippingDate}</div>
                        </div>}

                    <div className="mt-15"><OrderProductDtoList orderProductDtoList={data.orderProductDtoList} isEnglish={isEnglish} /></div>

                    {/* shipping info and payment method */}
                    <div className="grid grid-row-1 grid-cols-3 border-t border-b border-gray-300 pt-14 pb-15">
                        <div className="flex flex-col px-20 justify-center">
                            <div className="">
                                <div className="font-bold ">Shipping Address</div>
                                <div className="pt-6">{data.receiver}</div>
                                <div className="pt-2">
                                    <div>{data.shippingAddress}</div>
                                </div>
                                <div className="pt-2">{data.phoneNumber}</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div>
                                <div className="font-bold ">Payment Method</div>
                                <div className="pt-6">{data.paymentMethod.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                            </div>
                        </div>

                        <div className="flex flex-col px-20 items-center">
                            <div>
                                <div className="font-bold ">Shipping Method</div>
                                <div className="pt-6">{data.shippingMethod.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Shipping</div>
                                <div className="pt-2">{data.shippingMethod === "STANDARD" ? "Takes Up to 3-10 days" : "Takes Up to 2-4 days"}</div>
                            </div>
                        </div>
                    </div>

                    {/* price summary */}
                    <div className=" flex flex-col mt-5 px-40 py-10 rounded-lg">

                        <div className="flex justify-end mb-6 font-bold">HKD</div>

                        <div className="flex flex-row justify-between">
                            <div className="mb-6">Original Price</div>
                            <div classNam>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(data.originalPrice)}</div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="mb-6">Promotion Discount</div>
                            <div className>- {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(data.promotionPrice)}</div>
                        </div>



                        <div className="flex flex-row justify-between">
                            <div>Discount Code</div>
                            <div>{data.discountPrice}</div>
                        </div>
                        <div className="mt-2 text-gray-500 italic mb-6">{data.discountCodeUsed === null ? "No Discount Code applied" : data.discountCodeUsed}</div>

                        <div className="flex flex-row justify-between mb-3">
                            <div className="mb-6">Transportation Fee</div>
                            <div>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(data.transportationPrice)}</div>
                        </div>

                        <div className="flex flex-row justify-between border-t border-gray-600 py-4">
                            <div className="justify-start font-bold">Total</div>
                            <div className="justify-end  font-bold">{data.totalPrice}</div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-2">
                        <button className="bg-buttonMain text-white px-10 py-2 rounded-lg drop-shadow-lg hover:bg-gray-800 cursor-pointer text-2xl">Return To Previous Page</button>
                    </div>

                </div>
            </div>

            <div><EntireFooter /></div>

            <div className="z-50">
                <div className="md:hideen"><WindowScrollToTopButton /></div>
                <div className="relative z-30">
                    <AIAgentButton />
                </div>
            </div>
        </div>
    )
}

