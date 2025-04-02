import { useSelector } from "react-redux"

export const ProductListSection = () => {

    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en"
    const orderList = useSelector((state) => state.order.orderItemsList)

    if (!orderList || orderList.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    return (
        <div className="max-h-[400px] overflow-y-auto overscroll-contain flex flex-col gap-3 rounded">
            {orderList.map((item) => {
                const productNameInChinese = item.productTranslationDtoList.find((dto) => dto.languageCode === "zh-hk").productName;
                const productNameInEnglish = item.productTranslationDtoList.find((dto) => dto.languageCode === "en").productName;
                const productVariantDto = item.productVariantDto;
                return (
                    <div className="border border-gray-300 flex flex-row text-sm items-center rounded-lg">

                        <div className="rounded-l-md w-40 h-40 flex items-center justify-center overflow-hidden">
                            <img
                                src={item.productDisplayDto.url}
                                alt=""
                                className="w-full h-full object-contain block"
                            />
                        </div>



                        <div className="flex flex-col px-2 ml-10">
                            <div className="font-semibold">{isEnglish ? productNameInEnglish : productNameInChinese}</div>
                            <div className="mt-2 text-gray-900">{productVariantDto.gender === "F" ? "Female" : "Male"} - {productVariantDto.color} - {productVariantDto.size}</div>
                            <div className="text-gray-900">Qty: {item.quantity}</div>
                            <div className="mt-2">Total: HK {item.quantity * item.productPrice}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}