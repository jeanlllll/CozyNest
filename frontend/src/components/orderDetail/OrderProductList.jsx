export const OrderProductDtoList = ({ orderProductDtoList, isEnglish }) => {

    return (
        <div className="flex flex-col">
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
                        <div className="flex items-center justify-center">{dto.gender === "F" ? "Female" : "Male"}</div>
                        <div className="flex items-center justify-center">{dto.color}</div>
                        <div className="flex items-center justify-center">{dto.size}</div>
                        <div className="flex items-center justify-center">{dto.quantity}</div>
                        <div className="flex items-center justify-center">HKD {(dto.productTotalPrice / dto.quantity)}</div>
                        <div className="flex items-center justify-center font-semibold text-buttonMain">HKD {dto.productTotalPrice}</div>
                    </div>
                )
            })}
        </div>
    )
}