import { StatusBar } from "../components/cart/StatusBar"
import { PriceSummary } from "../components/cart/PriceSummary"
import { CheckoutForm } from "../components/checkout/CheckoutForm"
import { ProductListSection } from "../components/checkout/ProductListSection"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState, useEffect } from "react";
import { postOrder } from "../api/postOrder";
import { setShippingInfo } from "../store/features/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetCartItemsList } from "../store/features/CartItemsSlice";
import { resetOrderPriceNDiscount } from "../store/features/orderSlice";

export const CheckoutPage = () => {
    const dispatch = useDispatch();

    const [isExpand, setIsExpand] = useState(false);

    const [formData, setFormData] = useState({
        receiver: "",
        phoneNumber: "",
        floorNBuilding: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    })

    useEffect(() => {
        resetOrderPriceNDiscount();
    })

    const orderItemsList = useSelector((state) => state.order.orderItemsList)
    const shippingInfoDto = useSelector((state) => state.order.shippingInfoDto)
    const deliveryMethod = useSelector((state) => state.order.transportationMethod)
    const discountCode = useSelector((state) => state.order.discountCodeInfo.discountCode)

    const handleSubmitOnClick = async () => {
        dispatch(setShippingInfo(formData));
        const orderCartItemDtoList = orderItemsList.map(item => ({
            cartItemId: item.cartItemId,
            quantity: item.quantity,
        }));

        const shippingInfoDto = {
            receiver: formData.receiver,
            phoneNumber: formData.phoneNumber,
            address: {
                floorNBuilding: formData.floorNBuilding, 
                street: formData.street,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                postalCode: formData.postalCode 
            }
        };

        try {
            const response = await postOrder(orderCartItemDtoList, shippingInfoDto, deliveryMethod, discountCode);

            if (response.status === 200) {
                const { checkoutUrl } = response.data;
                window.location.href = response.data.checkoutUrl;
                dispatch(resetOrderDetail);
            } else {
                console.error("Failed to place order", response)
            }
        } catch (err) {
            console.error("Order submission failed", err)
        }
    }

    return (
        <div className="w-full min:h-dvh flex flex-col items-center justify-center mb-20">
            <div className="container flex-1">
                <h1 className="font-bold text-3xl mt-13">Checkout</h1>
                <div className="mt-12">
                    <StatusBar status={"checkout"} />
                </div>

                <div className="flex flex-row gap-10 mt-18">
                    <div className="basis-5/9">
                        <CheckoutForm formData={formData} setFormData={setFormData} />
                    </div>
                    <div className="basis-4/9">
                        <div className="border border-buttonMain bg-buttonMain text-white  px-8 py-2 rounded-lg flex flex-row cursor-pointer justify-between" onClick={() => setIsExpand(!isExpand)}>
                            <div>
                                View Product List
                            </div>
                            <div className="">
                                <KeyboardArrowDownIcon />
                            </div>
                        </div>

                        {isExpand && <div className="mt-4">
                            <ProductListSection />
                        </div>}

                        <div className="border border-gray-300 rounded-lg px-8 py-8 h-115 mt-8">
                            <PriceSummary needButton={false} needTransportationFee={true} />
                            <button className="w-full border border-buttonMain bg-buttonMain text-white py-2 flex items-center justify-center rounded-md mt-3 cursor-pointer hover:bg-gray-800"
                                onClick={() => handleSubmitOnClick()}
                            >
                                Process To Payment
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}