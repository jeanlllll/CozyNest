import { genderChinese } from "../../assets/data/data";
import { colorChinese } from "../../assets/data/data";

export const OrderProductDtoList = ({ orderProductDtoList, isEnglish }) => {

    return (
        <div>
            <div className="hidden sm:flex flex-col">
                <div className="grid grid-row-1 grid-cols-9 border-b border-buttonMain text-buttonMain font-bold">
                    <div></div>
                    <div className="flex items-center justify-center col-span-2">Product Name</div>
                    <div className="flex items-center justify-center">Gender</div>
                    <div className="flex items-center justify-center">Color</div>
                    <div className="flex items-center justify-center">Size</div>
                    <div className="flex items-center justify-center">Quantity</div>
                    <div className="flex items-center justify-center">Price Per Unit</div>
                    <div className="flex items-center justify-center">Total Price</div>
                </div>

                {orderProductDtoList.map((dto) => {
                    const productNameInChinese = dto.productTranslationDtoList.find((item) => item.languageCode === "zh-hk").productName;
                    const productNameInEnglish = dto.productTranslationDtoList.find((item) => item.languageCode === "en").productName;
                    return (
                        <div className="grid grid-row-1 grid-cols-9 border-t border-gray-300 py-3">
                            <div className="flex items-center justify-center"><img src={dto.productDisplayDto.url} alt="" className="w-42 h-42 rounded-md" /></div>
                            <div className="flex items-center justify-center col-span-2">{isEnglish ? productNameInEnglish : productNameInChinese}</div>
                            <div className="flex items-center justify-center">{isEnglish ? (dto.gender === "F" ? "Female" : "Male") : (genderChinese[dto.gender])}</div>
                            <div className="flex items-center justify-center">{isEnglish ? (dto.color) : (colorChinese[dto.color])}</div>
                            <div className="flex items-center justify-center">{dto.size}</div>
                            <div className="flex items-center justify-center">{dto.quantity}</div>
                            <div className="flex items-center justify-center">HKD {(dto.productTotalPrice / dto.quantity)}</div>
                            <div className="flex items-center justify-center font-semibold text-buttonMain">HKD {dto.productTotalPrice}</div>
                        </div>
                    )
                })}
            </div>

            <div className="sm:hidden">
                {orderProductDtoList.map((dto) => {
                    const productNameInChinese = dto.productTranslationDtoList.find((item) => item.languageCode === "zh-hk").productName;
                    const productNameInEnglish = dto.productTranslationDtoList.find((item) => item.languageCode === "en").productName;
                    return (
                        <div className="border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <img 
                                        src={dto.productDisplayDto.url} 
                                        alt="" 
                                        className="w-24 h-24 rounded-md object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {isEnglish ? productNameInEnglish : productNameInChinese}
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">{isEnglish ? "Gender: " : "性別: "}</span>
                                            {isEnglish ? (dto.gender === "F" ? "Female" : "Male") : (genderChinese[dto.gender])}
                                        </div>
                                        <div>
                                            <span className="font-medium">{isEnglish ? "Color: " : "顏色: "}</span>
                                            {isEnglish ? dto.color : colorChinese[dto.color]}
                                        </div>
                                        <div>
                                            <span className="font-medium">{isEnglish ? "Size: " : "尺寸: "}</span>
                                            {dto.size}
                                        </div>
                                        <div>
                                            <span className="font-medium">{isEnglish ? "Quantity: " : "數量: "}</span>
                                            {dto.quantity}
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">{isEnglish ? "Price Per Unit: " : "單價: "}</span>
                                            HKD {(dto.productTotalPrice / dto.quantity).toFixed(2)}
                                        </div>
                                        <div className="text-buttonMain font-semibold text-sm">
                                            <span className="font-medium text-gray-600">{isEnglish ? "Total: " : "總額: "}</span>
                                            HKD {dto.productTotalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}