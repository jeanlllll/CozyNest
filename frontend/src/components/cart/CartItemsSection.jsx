import { useDispatch, useSelector } from "react-redux"
import { setCartItemsList, setShowAlertCartItemIdList } from "../../store/features/CartItemsSlice";
import { CustomButton } from "../CustomButton";
import { colorChinese } from "../../assets/data/data";
import { genderChinese } from "../../assets/data/data";
import { CustomNumberField } from "./numberField/CustomNumberField";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { deleteCartItem } from "../../api/deleteCartItem"
import { patchCartItemQuantity } from "../../api/patchCartItemQuantity"
import { useEffect } from "react";
import { setOrderItemsList } from "../../store/features/orderSlice";

export const CartItemsSection = ({ data }) => {

    const dispatch = useDispatch();
    const cartItemList = useSelector((state) => state.cart.cartItemsList);
    const orderItemList = useSelector((state) => state.order.orderItemsList)

    useEffect(() => {
        dispatch(setCartItemsList(data));
    }, [data, dispatch])

    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en";
    const showAlertCartItemIdList = useSelector((state) => state.cart.showAlertCartItemIdList)

    useEffect(() => {
        if (orderItemList.length === 0 && cartItemList.length > 0) {
            const newOrderList = cartItemList.map((item) => ({
                ...item,
                selected: true
            }))
            dispatch(setOrderItemsList(newOrderList))
        }
    }, [dispatch, orderItemList.length, cartItemList])

    const handleProductQuantityOnChange = async ({ cartItemId, value }) => {
        if (value <= 0) return;
        const response = await patchCartItemQuantity(cartItemId, value)
        if (response.status === 200) {
            const newCartList = cartItemList.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity: value } : item
            )
            dispatch(setCartItemsList(newCartList))
            const newOrderList = orderItemList.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity: value } : item
            )
            dispatch(setOrderItemsList(newOrderList))
            const newShowAlertCartItemIdList = showAlertCartItemIdList.filter((id) => id !== cartItemId)
            dispatch(setShowAlertCartItemIdList(newShowAlertCartItemIdList))
        } else if (response.status === 400) {
            const newShowAlertCartItemIdList = [...new Set([...showAlertCartItemIdList, cartItemId])];
            dispatch(setShowAlertCartItemIdList(newShowAlertCartItemIdList))
        }
    }

    const handleDeletecartItemEvent = async ({ cartItemId }) => {
        const response = await deleteCartItem({ cartItemId });
        if (response.status === 200) {
            const newCartItemsList = cartItemList.filter(item => item.cartItemId !== cartItemId);
            dispatch(setCartItemsList(newCartItemsList));
            const newOrderItemsList = orderItemList.filter(item => item.cartItemId !== cartItemId);
            dispatch(setOrderItemsList(newOrderItemsList));
            const newShowAlertCartItemIdList = showAlertCartItemIdList.filter((id) => id !== cartItemId);
            dispatch(setShowAlertCartItemIdList(newShowAlertCartItemIdList));
        }
    }

    const handleOrderItemsListOnChange = (cartItemId) => {
        const updatedList = orderItemList.map((item) => {
            if (item.cartItemId === cartItemId) {
                return { ...item, selected: !item.selected };
            }
            return item;
        });
        dispatch(setOrderItemsList(updatedList));
    }

    return (
        <div className="w-full">
            {/* Desktop Layout */}
            <div className="hidden sm:block sm:text-lg">
                {/* Header */}
                <div className="grid grid-cols-8 border-b-2 border-buttonMain py-2">
                    <div className="col-span-2 pl-11">{isEnglish ? "Product Name" : "商品名稱"}</div>
                    <div className="col-span-1 text-center">{isEnglish ? "Color" : "顏色"}</div>
                    <div className="col-span-1 text-center">{isEnglish ? "Gender" : "性別"}</div>
                    <div className="col-span-1 text-center">{isEnglish ? "Size" : "尺寸"}</div>
                    <div className="col-span-1 text-center">{isEnglish ? "Quantity" : "數量"}</div>
                    <div className="col-span-1 text-center">{isEnglish ? "Price Per Unit" : "單價"}</div>
                    <div className="col-span-1 px-4">{isEnglish ? "Total Price" : "總價"}</div>
                </div>

                {/* Items */}
                {cartItemList.map((item) => {
                    const productName = item.productTranslationDtoList.find((dto) => dto.languageCode === language).productName;
                    const productVariantDto = item.productVariantDto;
                    const gender = productVariantDto.gender;
                    const color = productVariantDto.color;
                    const size = productVariantDto.size;
                    const cartItemId = item.cartItemId;
                    const isChecked = orderItemList.find(order => order.cartItemId === cartItemId)?.selected;

                    return (
                        <div key={item.cartItemId} className="grid grid-cols-8 border-b border-gray-300 py-4 items-center">
                            <div className="col-span-2 flex items-center gap-4">
                                <div className="flex items-center">
                                    <CustomButton
                                        value={cartItemId}
                                        isChecked={isChecked}
                                        onChangeFunc={() => handleOrderItemsListOnChange(cartItemId)}
                                        color="gray"
                                        widthNheight={6}
                                    />
                                </div>
                                <img src={item.productDisplayDto.url} alt="" className="w-40 h-40 rounded-lg" />
                                <span className="ml-2">{productName}</span>
                            </div>
                            <div className="col-span-1 text-center">{isEnglish ? color : colorChinese[color]}</div>
                            <div className="col-span-1 text-center">{isEnglish ? gender : genderChinese[gender]}</div>
                            <div className="col-span-1 text-center">{size}</div>
                            <div className="col-span-1 flex justify-center">
                                <CustomNumberField
                                    value={item.quantity}
                                    onChangeFunc={handleProductQuantityOnChange}
                                    cartItemId={cartItemId}
                                />
                            </div>
                            <div className="col-span-1 text-center">HKD {item.productPrice}</div>
                            <div className="col-span-1 flex justify-between items-center px-4">
                                <span>HKD {new Intl.NumberFormat('en-US').format(item.productPrice * item.quantity)}</span>
                                <button onClick={() => handleDeletecartItemEvent({ cartItemId })} className="text-gray-500 cursor-pointer">
                                    <DeleteForeverRoundedIcon />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
                <div className="space-y-4">
                    {cartItemList.map((item) => {
                        const productName = item.productTranslationDtoList.find((dto) => dto.languageCode === language).productName;
                        const productVariantDto = item.productVariantDto;
                        const gender = productVariantDto.gender;
                        const color = productVariantDto.color;
                        const size = productVariantDto.size;
                        const cartItemId = item.cartItemId;
                        const isChecked = orderItemList.find(order => order.cartItemId === cartItemId)?.selected;

                        return (
                            <div key={item.cartItemId} className="border-b border-gray-300 p-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center mt-1">
                                        <CustomButton
                                            value={cartItemId}
                                            isChecked={isChecked}
                                            onChangeFunc={() => handleOrderItemsListOnChange(cartItemId)}
                                            color="gray"
                                            widthNheight={6}
                                        />
                                    </div>

                                    <img src={item.productDisplayDto.url} alt="" className="w-24 h-24 rounded-lg object-cover" />

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium text-sm mb-1">{productName}</div>
                                            <button onClick={() => handleDeletecartItemEvent({ cartItemId })} className="text-gray-500 p-1 cursor-pointer">
                                                <DeleteForeverRoundedIcon className="text-xl" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-600 mb-2">
                                            {isEnglish ? color : colorChinese[color]} / {isEnglish ? gender : genderChinese[gender]} / {size}
                                        </div>

                                        <div className="flex flex-col justify-start">
                                            <div className="text-xs text-gray-600">HKD {item.productPrice}</div>
                                            <div className="font-medium text-sm">HKD {new Intl.NumberFormat('en-US').format(item.productPrice * item.quantity)}</div>
                                        </div>

                                        <div className="flex justify-between items-end mt-6">
                                            <CustomNumberField
                                                value={item.quantity}
                                                onChangeFunc={handleProductQuantityOnChange}
                                                cartItemId={cartItemId}
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}