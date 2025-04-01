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

export const RightProductIntroSection = ({ data, isEnglish }) => {

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
            if (gender === 'F') sizeListForF.push({size, productVariantId});
            if (gender === 'M') sizeListForM.push({size, productVariantId});
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
            handleColorSelectedEvent(selectColor, variant.map((v) => ({ size: v.size, gender: v.gender, displayId: v.displayId, productVariantId: v.productVariantId})),
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
            dispatch(setSizeNProductVariantIdSelected({size, productVariantId}));
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
        const response = await addProductToCart({productId, productVariantId})
        if (response.status === 200) {
            dispatch(setAlert({ message: "Added successfully.", type: "success" }));
        } else if (response.status === 400) {
            dispatch(setAlert({ message: "Product already in cart.", type: "error" }));
        }
        setTimeout(() => {
            dispatch(setAlert({ message: "", type: "" }));
        }, 3000);
    }

    return (
        <div className="flex flex-col">
            
            <h1 className="text-gray-600 text-xl mb-4">All/{data.categoryDto.name}/{data.categoryTypeDto.name}</h1>
            <h1 className="text-3xl font-bold">{data.name}</h1>

            <div className="mt-3">
                Materials:{" "}
                {data.productMaterialDtoList
                    .map((m) => `${m.percentage}% ${m.translatedName}`)
                    .join(", ")}
            </div>

            <div className="text-gray-600">
                <div className="mt-5 mb-1">{isNoRating ? "No Rating Given Yet" : "Rating " + data.avgRating}</div>
                <StarRating rate={isNoRating ? 0 : data.avgRating} isReadOnly={true} />
            </div>

            <h2 className="text-xl mt-4">HK$ {data.price}</h2>

            <div className="relative">
                {/* ColorsSections */}
                <div className="mt-4">Colors</div>

                <div className="flex mr-3 mt-2">
                    {colorSizeMap.size > 0 &&
                        Array.from(colorSizeMap.entries()).map(([color, variants]) => {
                            return (
                                <div key={color} className="">
                                    <div className={`w-8 h-8 ml-1 mr-2 cursor-pointer rounded-full ${productColor[color]} border-2 border-gray-300
                                                ${colorSelected === color ? "outline-2 outline-offset-2 outline-gray-500 drop-shadow-sm" : ""}`}
                                        onClick={() => handleColorSelectedEvent(color, variants.map((v) => ({ size: v.size, gender: v.gender, displayId: v.displayId, 
                                            productVariantId: v.productVariantId })), variants[0].displayId)}
                                    >
                                    </div>

                                    {/* sizes */}
                                    <div className="absolute top-18 left-0 flex flex-row mt-8">
                                        {isCoupleCategory && <GenderSelector isEnglish={isEnglish}/>}
                                        {sizeList.map((size, index) => (
                                            colorSelected === color &&
                                            <SizeButton key={index} isAvailable={colorSelected === "" ||
                                                availableSizeList.some((item) => item.size === size)} size={size} sizeSelected={sizeSelected.size}
                                                onClickFunc={handleSizeOnClickEvent} productVariantId={availableSizeList.find((item) => item.size === size)?.productVariantId}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                </div>


                {/* add to chart */}
                <div className="flex px-8 bg-buttonMain w-82 py-1.5 text-white rounded-md items-center mt-22
                    justify-center text-lg cursor-pointer hover:bg-gray-800 drop-shadow-lg"
                    onClick={() => handleSubmitOnClick()}
                >
                    Add To Cart
                </div>
                {showAlertToSelectSize && <div>Please select size first.</div>}
            </div>

        </div>
    )
}