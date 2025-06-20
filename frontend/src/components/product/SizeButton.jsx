import { setSizeNProductVariantIdSelected } from "../../store/features/productPageSlice";
import { useDispatch } from "react-redux";

export const SizeButton = ({isAvailable, size, sizeSelected, onClickFunc, productVariantId}) => {

    return (
        <div
            className={`relative w-18 py-2 rounded-md text-white text-center drop-shadow-lg
                                        ${isAvailable ? "bg-buttonMain hover:bg-gray-800 cursor-pointer" :
                    "bg-gray-400 opacity-50 cursor-not-allowed"} ${sizeSelected === size? "ring-2 ring-offset-2 ring-gray-800": ""}`}
            onClick={() => (onClickFunc({isAvailable, size, productVariantId}))}
        >
            {size}
            {!isAvailable && (
                <div className="absolute left-0 top-1/2 w-full border-t-2 border-white transform -rotate-20"></div>
            )}
        </div>
    )

}