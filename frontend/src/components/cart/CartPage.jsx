import { useLoaderData } from "react-router"
import { StatusBar } from "./StatusBar"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CartItemsSection } from "./CartItemsSection";
import { setCartItemsList } from "../../store/features/CartItemsSlice";
import { verifyDiscountCode } from "../../api/verifyDiscountCode";
import { setDiscountCodeInfo } from "../../store/features/orderSlice";

export const CartPage = () => {

    const data = useLoaderData();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCartItemsList(data));
    })

    const orderItemList = useSelector((state) => state.order.orderItemsList);

    const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);
    const [promotionDiscount, setPromotionDiscount] = useState(0);

    useEffect(() => {
        let newTotal = 0;
        let itemPurcahse = 0;
        orderItemList.forEach((item) => {
            if (item.selected) {
                newTotal += item.quantity * item.productPrice;
                itemPurcahse += item.quantity;
            }
        });
        setTotalOriginalPrice(newTotal);

        let hasDiscount = itemPurcahse >= 3
        let discount = hasDiscount ? newTotal * 0.1 : 0;

        setPromotionDiscount(discount);
    }, [orderItemList])

    const [appliedNotSucccess, setAppliedNotSuccess] = useState(false);
    const [discountCodeInput, setDiscountCodeInput] = useState("");

    const handleVerifyDiscountCode = async ({ discountCode }) => {
        const response = await verifyDiscountCode(discountCode);
        if (response.status === 200) {
            dispatch(setDiscountCodeInfo(response.data));
            setAppliedNotSuccess(false);
        } else {
            setAppliedNotSuccess(true);
        }
    }

    const discountCodeInfo = useSelector((state) => state.order.discountCodeInfo)
    const [discountCodeAmount, setDiscountCodeAmount] = useState(0);

    useEffect(() => {
        if (discountCodeInfo !== null) {
            const base = totalOriginalPrice - promotionDiscount;
            if (base >= discountCodeInfo.minPurchaseAmount) {
                if (discountCodeInfo.discountType === "AMOUNT") {
                    setDiscountCodeAmount(discountCodeInfo.discountValue);
                }
                if (discountCodeInfo.discountType === "PERCENTAGE") {
                    setDiscountCodeAmount(base * discountCodeInfo.discountValue / 100);
                }
            } else {
                dispatch(setDiscountCodeInfo(null));
                setDiscountCodeAmount(0);
            }
        }
    }, [discountCodeInfo, totalOriginalPrice, promotionDiscount])

    return (
        <div className="w-full min:h-dvh flex flex-col items-center justify-center mb-20">
            <div className="container flex-1">
                <h1 className="font-bold text-3xl mt-13">Shopping Cart</h1>
                <div className="mt-12">
                    <StatusBar status={"cart"} />
                </div>

                <div className="mt-20 ">
                    <CartItemsSection />
                </div>

                <div className="border border-gray-300 flex flex-col w-full mt-16 h-135 rounded-xl text-xl px-28 py-16">
                    <div className="flex justify-start"><h1 className="font-bold">Order Summary</h1></div>

                    <div className="flex justify-end mb-2">HKD</div>

                    <div className="flex flex-row justify-between">
                        <div className="mb-6">Original Price</div>
                        <div classNam>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(totalOriginalPrice)}</div>
                    </div>

                    <div className="flex flex-row justify-between">
                        <div className="mb-6">Promotion Discount</div>
                        <div className>- {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(promotionDiscount)}</div>
                    </div>

                    <div className="mb-2">Discount Code</div>

                    <div className="flex flex-row justify-between">
                        <div>
                            <input
                                type="text"
                                className="border px-2 py-1.5 text-base rounded border-buttonSecond w-55 drop-shadow-lg"
                                placeholder="Discount Code"
                                value={discountCodeInput}
                                onChange={(e) => setDiscountCodeInput(e.target.value)}
                            />
                            <button className="bg-buttonMain text-white px-5 py-2 text-base rounded-md ml-3 drop-shadow-lg cursor-pointer" onClick={() => handleVerifyDiscountCode({ discountCode: discountCodeInput })}>Apply</button>
                        </div>
                        <div className="flex justify-end items-center">- {new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(discountCodeAmount)}</div>
                    </div>

                    <div className="mb-2">
                        {appliedNotSucccess && <div className="text-buttonMain font-bold text-sm mb-5">Discount code not valid</div>}
                    </div>


                    <div className="flex flex-row justify-between border-t border-gray-600 py-4">
                        <div className="justify-start font-bold">Total</div>
                        <div className="justify-end  font-bold">{new Intl.NumberFormat('en-US', { minimumFractionDigits: 1 }).format(totalOriginalPrice - promotionDiscount - discountCodeAmount)}</div>
                    </div>

                    <div className="flex flex-row w-full gap-5 mt-3">
                        <div className="basis-1/2 bg-buttonMain py-1.5 text-white hover:bg-gray-800 rounded-md flex justify-center items-center cursor-pointer  drop-shadow-lg" onClick={() => navigate("/")}>
                            Continue Shopping
                        </div>
                        <div className="basis-1/2 bg-buttonMain py-1.5 text-white hover:bg-gray-800 rounded-md flex justify-center  items-center cursor-pointer  drop-shadow-lg">
                            Process To Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

