import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTotalOriginalAmount, setDiscountAmount, setDiscountCodeInfo, setPromotionAmount, setTransportationMethod } from "../../store/features/orderSlice";
import { verifyDiscountCode } from "../../api/verifyDiscountCode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const PriceSummary = ({ needButton, needTransportationFee, isEnglish }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderItemList = useSelector((state) => state.order.orderItemsList);

    const totalOriginalPrice = useSelector((state) => state.order.totalOriginalAmount)
    const promotionAmount = useSelector((state) => state.order.promotionAmount)
    const discountAmount = useSelector((state) => state.order.discountAmount)
    const discountCodeInfo = useSelector((state) => state.order.discountCodeInfo)
    const cartItemsList = useSelector((state) => state.cart.cartItemsList)

    const transportationMethod = useSelector((state) => state.order.transportationMethod)
    const [transportationFee, setTransportationFee] = useState(20);

    useEffect(() => {
        if (transportationMethod === "STANDARD") {
            if ((totalOriginalPrice - promotionAmount - discountAmount) >= 300) {
                setTransportationFee(0);
            } else {
                setTransportationFee(20);
            }
        } else {
            setTransportationFee(40);
        }
    }, [dispatch, transportationMethod])

    useEffect(() => {
        let newTotal = 0;
        let itemPurcahse = 0;
        orderItemList.forEach((item) => {
            if (item.selected) {
                newTotal += item.quantity * item.productPrice;
                itemPurcahse += item.quantity;
            }
        });
        dispatch(setTotalOriginalAmount(newTotal));

        let hasDiscount = itemPurcahse >= 3
        let discount = hasDiscount ? newTotal * 0.1 : 0;

        dispatch(setPromotionAmount(discount));
    }, [dispatch, orderItemList, discountCodeInfo])

    const [appliedNotSucccess, setAppliedNotSuccess] = useState(false);
    const [discountCodeInput, setDiscountCodeInput] = useState("");

    const handleVerifyDiscountCode = async () => {
        const response = await verifyDiscountCode(discountCodeInput);
        if (response.status === 200) {
            dispatch(setDiscountCodeInfo(response.data));
            setAppliedNotSuccess(false);

            const base = totalOriginalPrice - promotionAmount;
            if (base >= discountCodeInfo.minPurchaseAmount) {
                if (discountCodeInfo.discountType === "AMOUNT") {
                    dispatch(setDiscountAmount(discountCodeInfo.discountValue));
                }
                if (discountCodeInfo.discountType === "PERCENTAGE") {
                    dispatch(setDiscountAmount(base * discountCodeInfo.discountValue / 100));
                }
            } else {
                dispatch(setDiscountCodeInfo(null));
                setDiscountAmount(0);
            }

        } else {
            setAppliedNotSuccess(true);
            dispatch(setDiscountCodeInfo(null));
            dispatch(setDiscountAmount(0));
        }
    }

    useEffect(() => {
        if (discountCodeInfo !== null) {
            const base = totalOriginalPrice - promotionAmount;
            if (base >= discountCodeInfo.minPurchaseAmount) {
                if (discountCodeInfo.discountType === "AMOUNT") {
                    dispatch(setDiscountAmount(discountCodeInfo.discountValue));
                }
                if (discountCodeInfo.discountType === "PERCENTAGE") {
                    dispatch(setDiscountAmount(base * discountCodeInfo.discountValue / 100));
                }
            } else {
                dispatch(setDiscountCodeInfo(null));
                dispatch(setDiscountAmount(0));
            }
        }
    }, [discountCodeInfo, totalOriginalPrice, promotionAmount])

    return (
        <div>
            <div className="flex justify-start">
                <h1 className="font-bold">{isEnglish ? "Order Summary" : "訂單摘要"}</h1>
            </div>

            <div className="flex justify-end mb-2">HKD</div>

            <div className="flex flex-row justify-between">
                <div className="mb-4 sm:mb-6">{isEnglish ? "Original Price" : "原價"}</div>
                <div>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(totalOriginalPrice)}</div>
            </div>

            <div className="flex flex-row justify-between">
                <div className="mb-4 sm:mb-6">{isEnglish ? "Promotion Discount" : "促銷折扣"}</div>
                <div>- {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(promotionAmount)}</div>
            </div>

            <div className="mb-4 sm:mb-6">
                <div className="mb-2 flex flex-row">
                    <div>{isEnglish ? "Discount Code" : "優惠碼"}</div>
                    {discountAmount !== 0 && <div className="text-gray-600 italic ml-3 sm:ml-5 text-sm sm:text-lg flex items-center">{discountCodeInfo.discountCode}</div>}
                </div>
                <div className="relative flex flex-col sm:flex-row justify-between mb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-0">
                        <input
                            type="text"
                            className="px-2 py-1.5 w-full sm:w-45 rounded border text-sm sm:text-lg border-buttonSecond drop-shadow-lg"
                            placeholder={isEnglish ? "Discount Code" : "優惠碼"}
                            value={discountCodeInput}
                            onChange={(e) => setDiscountCodeInput(e.target.value)}
                        />
                        <button
                            className="px-4 py-1.5 mt-2 sm:mt-0 sm:ml-2 text-sm sm:text-lg rounded-md bg-buttonMain border-buttonMain text-white cursor-pointer"
                            onClick={() => handleVerifyDiscountCode()}
                        >
                            {isEnglish ? "Apply" : "使用"}
                        </button>
                    </div>
                    <div className="flex justify-end items-center">
                        - {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(discountAmount)}
                    </div>
                </div>
                <div className="mb-2">
                    {appliedNotSucccess && <div className="text-buttonMain font-bold text-sm mb-2 sm:mb-5">{isEnglish ? "Discount code not valid" : "優惠碼無效"}</div>}
                </div>
            </div>

            {needTransportationFee &&
                <div className="flex flex-row justify-between">
                    <div className="mb-4 sm:mb-6">{isEnglish ? "Transportation Fee" : "運費"}</div>
                    <div>+ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(transportationFee)}</div>
                </div>
            }

            <div className="flex flex-col justify-between border-t border-gray-600 py-3 sm:py-4">
                <div className="flex flex-row justify-between">
                <div className="justify-start font-bold">{isEnglish ? "Total" : "總計"}</div>
                <div className="justify-end font-bold">
                    { totalOriginalPrice !== 0
                        ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(
                            totalOriginalPrice - promotionAmount - discountAmount + (needTransportationFee ? transportationFee : 0)
                        )
                        : "0.0"
                    }
                </div>
                </div>
                

                {needButton &&
                    <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-5 mt-4 sm:mt-3">
                        <button
                            className="w-full sm:basis-1/2 bg-buttonMain py-2 sm:py-1.5 text-white hover:bg-gray-800 rounded-md flex justify-center items-center cursor-pointer drop-shadow-lg"
                            onClick={() => navigate("/")}
                        >
                            {isEnglish ? "Continue Shopping" : "繼續購物"}
                        </button>
                        <button
                            className="w-full sm:basis-1/2 bg-buttonMain py-2 sm:py-1.5 text-white hover:bg-gray-800 rounded-md flex justify-center items-center cursor-pointer drop-shadow-lg"
                            onClick={() => { navigate("/user/checkout"), window.scrollTo({ top: 0, left: 0 }) }}
                        >
                            {isEnglish ? "Process To Checkout" : "前往結帳"}
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}