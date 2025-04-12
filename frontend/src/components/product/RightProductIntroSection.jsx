import { StarRating } from "../starRating/StarRating";
import { productColor, sizeList } from "../../assets/data/data";
import { useDispatch, useSelector } from "react-redux";
import { SizeButton } from "./SizeButton";
import { setColorSelected, setColorSelectedProductDisplayId, setLargeImageDisplay, setLeftImageSelected, setSizeAvailableListForF, setSizeAvailableListForM, setSizeNProductVariantIdSelected, setAlert, resetSizeNProductVariantIdSelected } from "../../store/features/productPageSlice";
import { GenderSelector } from "./GenderSelector";
import { useParams } from "react-router";
import { transferToColorSizeMap } from "../../Helper/transferToColorSizeMap";
import { useEffect } from "react";
import { useState } from "react";
import { addProductToCart } from "../../api/addProductToCart";
import { categoryChinese } from "../../assets/data/data";
import { categoryTypeChinese } from "../../assets/data/data";

export const RightProductIntroSection = ({ data, isEnglish, avgRating }) => {

    const isNoRating = data.reviewList.length === 0;
    const colorSizeMap = transferToColorSizeMap(data.productVariantDtoList);
    const dispatch = useDispatch();

    const handleColorSelectedEvent = (color, sizeGenderAvailableList, productDisplayId) => {
        dispatch(setSizeNProductVariantIdSelected({ size: "", productVariantId: "" }))
        dispatch(setColorSelected(color))
        dispatch(setColorSelectedProductDisplayId(productDisplayId))
        const productDisplayDto = data.productDisplayDtoList.find((img) => img.id === productDisplayId);
        dispatch(setLargeImageDisplay(productDisplayDto.url));
        dispatch(setLeftImageSelected(productDisplayDto.id));

        const sizeListForF = [];
        const sizeListForM = [];
        sizeGenderAvailableList.forEach(({ size, gender, productVariantId }) => {
            if (gender === 'F') sizeListForF.push({ size, productVariantId });
            if (gender === 'M') sizeListForM.push({ size, productVariantId });
        })
        dispatch(setSizeAvailableListForF(sizeListForF));
        dispatch(setSizeAvailableListForM(sizeListForM));
    }

    const colorSelected = useSelector((state) => state.productPageGlobalState.colorSelected);
    const genderSelected = useSelector((state) => state.productPageGlobalState.genderSelected);
    const sizeAvailableListForF = useSelector((state) => state.productPageGlobalState.sizeAvailableListForF)
    const sizeAvailableListForM = useSelector((state) => state.productPageGlobalState.sizeAvailableListForM)
    const sizeSelected = useSelector((state) => state.productPageGlobalState.sizeNProductVariantIdSelected);

    useEffect(() => {
        if (colorSelected === "") {
            const [selectColor] = Array.from(colorSizeMap.keys());
            dispatch(setColorSelected(selectColor));
            const variant = colorSizeMap.get(selectColor);
            handleColorSelectedEvent(selectColor, variant.map((v) => ({ size: v.size, gender: v.gender, displayId: v.displayId, productVariantId: v.productVariantId })),
                variant[0].displayId)
        }
    }, [colorSelected, colorSizeMap])

    const { category } = useParams();
    const isCoupleCategory = category.toLowerCase() === "couple";
    let availableSizeList = [];
    if (isCoupleCategory) {
        availableSizeList = genderSelected === "M" ? sizeAvailableListForM : sizeAvailableListForF /*if it is equals to "", it also set it to F*/
    } else {
        availableSizeList = category === "women" ? sizeAvailableListForF : sizeAvailableListForM;
    }

    const handleSizeOnClickEvent = ({ isAvailable, size, productVariantId }) => {
        if (isAvailable) {
            dispatch(setSizeNProductVariantIdSelected({ size, productVariantId }));
            setShowAlertToSelectSize(false)
        }
    }

    const [showAlertToSelectSize, setShowAlertToSelectSize] = useState(false);
    const handleSubmitOnClick = async () => {
        const productId = data.productId;
        if (sizeSelected.size === "" && sizeSelected.productVariantId === "") {
            setShowAlertToSelectSize(true);
            return;
        }
        const productVariantId = sizeSelected.productVariantId;
        const response = await addProductToCart({ productId, productVariantId })
        if (response.status === 200) {
            dispatch(setAlert({ message: "Added successfully.", type: "success" }));
        } else if (response.status === 400) {
            dispatch(setAlert({ message: "Product already in cart.", type: "error" }));
        }
        setTimeout(() => {
            dispatch(setAlert({ message: "", type: "" }));
        }, 3000);
    }

    const categoryType = data.categoryTypeDto.name.charAt(0).toUpperCase() + data.categoryTypeDto.name.slice(1).toLowerCase();
    return (
        <div className="flex flex-col">

            <h1 className="sm:block text-gray-600 text-lg sm:text-xl mb-2 sm:mb-4">
                {isEnglish
                    ? `All / ${data.categoryDto.name} / ${data.categoryTypeDto.name}`
                    : `全部 / ${categoryChinese[data.categoryDto.name.toUpperCase()]} / ${categoryTypeChinese[categoryType]}`
                }
            </h1>
            <h1 className="text-2xl sm:text-3xl font-bold">{data.name}</h1>

            <div className="mt-2">
                {isEnglish ? "Materials" : "材質"}:{" "}
                {data.productMaterialDtoList
                    .map((m) => `${m.percentage}% ${m.translatedName}`)
                    .join(", ")}
            </div>

            <div className="text-gray-600">
                <div className="mt-3 sm:mt-4 mb-1">
                    {isNoRating
                        ? (isEnglish ? "No Rating Given Yet" : "暫無評分")
                        : (isEnglish ? "Rating " : "評分 ") + parseFloat(avgRating || 0).toFixed(2)}
                </div>
                <StarRating rating={isNoRating ? 0 : avgRating} isReadOnly={true} />
            </div>

            <h2 className="text-lg sm:text-xl mt-2 sm:mt-3">HK$ {data.price}</h2>

            <div className="relative">
                {/* ColorsSections */}
                <div className="mt-3 sm:mt-4">{isEnglish ? "Colors" : "顏色"}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {colorSizeMap.size > 0 &&
                        Array.from(colorSizeMap.entries()).map(([color, variants]) => (
                            <div
                                key={color}
                                className={`w-8 h-8 cursor-pointer rounded-full ${productColor[color]} border-2 border-gray-300
                                    ${colorSelected === color ? "outline-2 outline-offset-2 outline-gray-500 drop-shadow-sm" : ""}`}
                                onClick={() => handleColorSelectedEvent(color, variants.map((v) => ({
                                    size: v.size, gender: v.gender, displayId: v.displayId,
                                    productVariantId: v.productVariantId
                                })), variants[0].displayId)}
                            />
                        ))}
                </div>

                <div className="mt-6">
                    {isCoupleCategory && (
                        <div className="pb-3">
                            <GenderSelector isEnglish={isEnglish} />
                        </div>
                    )}
                    <div className="flex gap-3 sm:mt-3">
                        {sizeList.map((size, index) => (
                            colorSelected !== "" &&
                            <SizeButton
                                key={index}
                                isAvailable={availableSizeList.some((item) => item.size === size)}
                                size={size}
                                sizeSelected={sizeSelected.size}
                                onClickFunc={handleSizeOnClickEvent}
                                productVariantId={availableSizeList.find((item) => item.size === size)?.productVariantId}
                            />
                        ))}
                    </div>

                    <div className="flex px-8 bg-buttonMain w-full py-1.5 text-white rounded-md items-center mt-5 
                        justify-center text-lg cursor-pointer hover:bg-gray-800 drop-shadow-lg"
                        onClick={() => handleSubmitOnClick()}
                    >
                        {isEnglish ? "Add To Cart" : "加入購物車"}
                    </div>
                    {showAlertToSelectSize && <div className="text-red-500 text-sm mt-2 text-center">Please select size first.</div>}
                </div>
            </div>

        </div>
    )
}