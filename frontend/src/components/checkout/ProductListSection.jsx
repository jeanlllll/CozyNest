import { useSelector } from "react-redux"
import { genderChinese } from "../../assets/data/data";
import { colorChinese } from "../../assets/data/data";

export const ProductListSection = ({ isEnglish }) => {
    const orderList = useSelector((state) => state.order.orderItemsList)
    // Filter only selected items
    const selectedOrderList = orderList.filter(item => item.selected)

    if (!selectedOrderList || selectedOrderList.length === 0) {
        return <p className="text-gray-600 text-center py-4">{isEnglish ? "Your cart is empty." : "購物車是空的。"}</p>;
    }

    return (
        <div className="sm:max-h-[400px] overflow-y-auto overscroll-contain flex flex-col gap-3">
            {selectedOrderList.map((item) => {
                const productNameInChinese = item.productTranslationDtoList.find((dto) => dto.languageCode === "zh-hk").productName;
                const productNameInEnglish = item.productTranslationDtoList.find((dto) => dto.languageCode === "en").productName;
                const productVariantDto = item.productVariantDto;
                
                return (
                    <div key={item.cartItemId} className="border border-gray-300 flex flex-row items-start sm:items-center rounded-lg p-4 sm:p-0">
                        <div className="w-24 h-24 lg:w-40 lg:h-40 flex-shrink-0 rounded-l-md rounded-r-md sm:rounded-l-md sm:rounded-r-none overflow-hidden bg-gray-50">
                            <img
                                src={item.productDisplayDto.url}
                                alt={isEnglish ? productNameInEnglish : productNameInChinese}
                                className="w-full h-full object-cover lg:object-contain "
                            />
                        </div>

                        <div className="flex flex-col ml-4 lg:ml-6 flex-grow">
                            <div className="font-medium text-base">
                                {isEnglish ? productNameInEnglish : productNameInChinese}
                            </div>
                            
                            <div className="text-gray-600 text-sm lg:text-base mt-1">
                                {productVariantDto.gender === "F" 
                                    ? (isEnglish ? "Female" : genderChinese[productVariantDto.gender]) 
                                    : (isEnglish ? "Male" : genderChinese[productVariantDto.gender])} - 
                                {isEnglish ? productVariantDto.color : colorChinese[productVariantDto.color]} - {productVariantDto.size}
                            </div>

                            <div className="text-sm lg:text-base text-gray-600 mt-2">
                                {isEnglish ? "Qty: " : "數量："}{item.quantity}
                            </div>

                            <div className="mt-2 font-medium lg:text-base">
                                {isEnglish ? "Total: " : "總計："} HKD {new Intl.NumberFormat('en-US').format(item.quantity * item.productPrice)}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}