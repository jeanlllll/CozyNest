import { useDispatch, useSelector } from "react-redux"
import { setCartItemsList, setShowAlertCartItemIdList } from "../../store/features/CartItemsSlice";
import { CustomButton } from "../CustomButton";
import { colorChinese } from "../../assets/data/data";
import { genderChinese } from "../../assets/data/data";
import { CustomNumberField } from "./numberField/CustomNumberField";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { deleteCartItem } from "../../api/deleteCartItem"
import { patchCartItemQuantity } from "../../api/patchCartItemQuantity"
import { useEffect, useState } from "react";
import { setOrderItemsList } from "../../store/features/orderSlice";

export const CartItemsSection = () => {

    const dispatch = useDispatch();
    const cartItemList = useSelector((state) => state.cart.cartItemsList);
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en";
    const showAlertCartItemIdList = useSelector((state) => state.cart.showAlertCartItemIdList)

    const handleProductQuantityOnChange = async ({ cartItemId, value }) => {
        if (value <= 0) return;
        const response = await patchCartItemQuantity(cartItemId, value)
        if (response.status === 200) {
            const newList = cartItemList.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity: value } : item
            )
            dispatch(setCartItemsList(newList))
            const newShowAlertCartItemIdList = showAlertCartItemIdList.filter((id) => id !== cartItemId)
            dispatch(setShowAlertCartItemIdList(newShowAlertCartItemIdList))
        } else if (response.status === 400) {
            const newShowAlertCartItemIdList = [...new Set([...showAlertCartItemIdList, cartItemId])];
            dispatch(setShowAlertCartItemIdList(newShowAlertCartItemIdList))
        }
    }

    const orderItemList = useSelector((state) => state.order.orderItemsList);



    useEffect(() => {
        if (orderItemList.length === 0) {
            const newOrderList = cartItemList.map((item) => ({
                ...item,
                selected: true
            }))
            dispatch(setOrderItemsList(newOrderList))
        }
    }, [dispatch, orderItemList.length, cartItemList])


    const handleDeletecartItemEvent = async ({ cartItemId }) => {
        const response = await deleteCartItem({ cartItemId });
        if (response.status === 200) {
            const newCartItemsList = cartItemList.filter(item => item.cartItemId !== cartItemId);
            dispatch(setCartItemsList(newCartItemsList))
            const newShowAlertCartItemIdList = showAlertCartItemIdList.filter((id) => id !== cartItemId)
            dispatch(setShowAlertCartItemIdList(newShowAlertCartItemIdList))
        }
    }

    const handleOrderItemsListOnChange = ({ cartItemId }) => {
        console.log("Toggling item: ", cartItemId);
        const updatedList = orderItemList.map((item) =>
            item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item)
        dispatch(setOrderItemsList(updatedList))
    }



    return (
        <div className="">

            <div>
                <div className="flex flex-row border-b-2 border-buttonMain">
                    <div className="ml-15 ">
                        <div>ProductName</div>
                    </div>

                    <div className="ml-93">
                        <div>Color</div>
                    </div>

                    <div className="ml-25">
                        <div>Gender</div>
                    </div>

                    <div className=" ml-23">
                        <div>Size</div>
                    </div>

                    <div className="ml-29">
                        <div>Quantity</div>
                    </div>

                    <div className="ml-34">
                        <div>Price Per Unit</div>
                    </div>

                    <div className="ml-32">
                        <div>Total Price</div>
                    </div>
                </div>
            </div>
            {
                cartItemList.map((item) => {
                    const productName = item.productTranslationDtoList.find((dto) => dto.languageCode === language).productName
                    const productVariantDto = item.productVariantDto;
                    const gender = productVariantDto.gender;
                    const color = productVariantDto.color;
                    const size = productVariantDto.size;
                    const cartItemId = item.cartItemId;
                    const isChecked = orderItemList.find(order => order.cartItemId === cartItemId)?.selected;
                    return (
                        <div key={item.cartItemId} className="border-b border-gray-300 w-[1536px] h-50 flex flex-row text-lg items-center justify-between">
                            <div className="basis-1/9 flex flex-row items-center justify-center">
                                <div className="ml-14"><CustomButton value={item.cartItemId} isChecked={isChecked} onChangeFunc={() => handleOrderItemsListOnChange({ cartItemId: item.cartItemId })} color={"gray"} widthNheight={6} /></div>
                                <img src={item.productDisplayDto.url} alt="" className="w-40 h-40 rounded-lg ml-6" />
                            </div>
                            <div className="basis-2/10 flex justify-center ml-10 ">{productName}</div>
                            <div className="basis-1/10 flex justify-center">{isEnglish ? color : colorChinese[color]}</div>
                            <div className="basis-1/10 flex justify-center">{isEnglish ? gender : genderChinese[gender]}</div>
                            <div className="basis-1/10 flex justify-center">{size}</div>
                            <div className="basis-1/5/10 flex justify-center pl-4"><CustomNumberField value={item.quantity} onChangeFunc={handleProductQuantityOnChange} cartItemId={cartItemId}
                            /></div>
                            <div className="basis-2/10 flex justify-center">HKD {item.productPrice} / per unit</div>
                            <div className="basis-1/10 flex justify-center">HKD {new Intl.NumberFormat('en-US').format(item.productPrice * item.quantity)} </div>
                            <div className="basis-0.5/10 cursor-pointer flex justify-center ml-1" onClick={() => handleDeletecartItemEvent({ cartItemId })}>
                                <DeleteForeverRoundedIcon />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}