import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTotalOriginalAmount, setDiscountAmount, setDiscountCodeInfo, setPromotionAmount, setTransportationMethod } from "../../store/features/orderSlice";
import { verifyDiscountCode } from "../../api/verifyDiscountCode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const PriceSummary = ({ needButton, needTransportationFee }) => {

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
            <div className="flex justify-start"><h1 className="font-bold">Order Summary</h1></div>

            <div className="flex justify-end mb-2">HKD</div>

            <div className="flex flex-row justify-between">
                <div className="mb-6">Original Price</div>
                <div classNam>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(totalOriginalPrice)}</div>
            </div>

            <div className="flex flex-row justify-between">
                <div className="mb-6">Promotion Discount</div>
                <div className>- {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(promotionAmount)}</div>
            </div>

            <div className="mb-6">
                <div className="mb-2 flex flex-row">
                    <div>Discount Code</div>
                    {discountAmount !== 0 && <div className="text-gray-600 italic ml-5 text-md ">{discountCodeInfo.discountCode}</div>}
                </div>
                <div className="relative flex flex-row justify-between mb-1">
                    <div className="flex">
                        <input
                            type="text"
                            className="px-2 py-1 w-45 rounded border text-md border-buttonSecond drop-shadow-lg"
                            placeholder="Discount Code"
                            value={discountCodeInput}
                            onChange={(e) => setDiscountCodeInput(e.target.value)}
                        />
                        <div className="flex items-center justify-center">
                            <button className="px-4 py-1.5 ml-2 text-md rounded-md bg-buttonMain border-buttonMain text-white  cursor-pointer" onClick={() => handleVerifyDiscountCode()}>Apply</button>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">- {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(discountAmount)}</div>
                </div>
                <div className="mb-2">
                    {appliedNotSucccess && <div className="text-buttonMain font-bold text-sm mb-5">Discount code not valid</div>}
                </div>
            </div>

            {needTransportationFee &&
                <div className="flex flex-row justify-between">
                    <div className="mb-6">Transportation Fee</div>
                    <div classNam>+ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(transportationFee)}</div>
                </div>
            }


            <div className="flex flex-row justify-between border-t border-gray-600 py-4">
                <div className="justify-start font-bold">Total</div>
                <div className="justify-end  font-bold">{totalOriginalPrice !== 0 ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(totalOriginalPrice - promotionAmount - discountAmount + transportationFee) : 0.0}</div>
            </div>

            {needButton && <div className="flex flex-row w-full gap-5 mt-3">
                <div className="basis-1/2 bg-buttonMain py-1.5 text-white hover:bg-gray-800 rounded-md flex justify-center items-center cursor-pointer  drop-shadow-lg" onClick={() => navigate("/")}>
                    Continue Shopping
                </div>
                <div className="basis-1/2 bg-buttonMain py-1.5 text-white hover:bg-gray-800 rounded-md flex justify-center  items-center cursor-pointer  drop-shadow-lg"
                    onClick={() => { navigate("/user/checkout"), window.scrollTo({ top: 0, left: 0 }) }}>
                    Process To Checkout
                </div>
            </div>}
        </div>
    )
}