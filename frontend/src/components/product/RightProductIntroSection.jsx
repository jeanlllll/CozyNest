import { StarRating } from "../starRating/StarRating";
import { productColor, sizeList } from "../../assets/data/data";
import { useDispatch, useSelector } from "react-redux";
import { SizeButton } from "./SizeButton";
import { setColorSelected, setColorSelectedProductDisplayId, setLargeImageDisplay, setLeftImageSelected, setSizeAvailableListForF, setSizeAvailableListForM } from "../../store/features/productPageSlice";
import { GenderSelector } from "./GenderSelector";
import { useParams } from "react-router";
import { transferToColorSizeMap } from "../../Helper/transferToColorSizeMap";
import { useEffect } from "react";

export const RightProductIntroSection = ({ data }) => {

    const isNoRating = data.reviewList.length === 0;
    const colorSizeMap = transferToColorSizeMap(data.productVariantDtoList);
    const dispatch = useDispatch();

    const handleColorSelectedEvent = (color, sizeGenderAvailableList, productDisplayId) => {
        dispatch(setColorSelected(color))
        dispatch(setColorSelectedProductDisplayId(productDisplayId))
        const productDisplayDto = data.productDisplayDtoList.find((img) => img.id === productDisplayId);
        dispatch(setLargeImageDisplay(productDisplayDto.url));
        dispatch(setLeftImageSelected(productDisplayDto.id));

        const sizeListForF = [];
        const sizeListForM = [];
        sizeGenderAvailableList.forEach(({ size, gender }) => {
            if (gender === 'F') sizeListForF.push(size);
            if (gender === 'M') sizeListForM.push(size);
        })
        dispatch(setSizeAvailableListForF(sizeListForF));
        dispatch(setSizeAvailableListForM(sizeListForM));
    }

    const colorSelected = useSelector((state) => state.productPageGlobalState.colorSelected);
    const genderSelected = useSelector((state) => state.productPageGlobalState.genderSelected);
    const sizeAvailableListForF = useSelector((state) => state.productPageGlobalState.sizeAvailableListForF)
    const sizeAvailableListForM = useSelector((state) => state.productPageGlobalState.sizeAvailableListForM)

    useEffect(() => {
        if (colorSelected === "") {
            const [selectColor] = Array.from(colorSizeMap.keys());
            dispatch(setColorSelected(selectColor));
            const variant = colorSizeMap.get(selectColor);
            handleColorSelectedEvent(selectColor, variant.map((v) => ({ size: v.size, gender: v.gender })),
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

            <div>
                {/* ColorsSections */}
                <div className="mt-4">Colors</div>

                <div className="flex mr-3 mt-2">
                    {colorSizeMap.size > 0 &&
                        Array.from(colorSizeMap.entries()).map(([color, variants]) => {
                            return (
                                <div key={color} className="">
                                    <div className={`w-8 h-8 ml-1 mr-2 cursor-pointer rounded-full ${productColor[color]} border-2 border-gray-300
                                                ${colorSelected === color ? "outline-2 outline-offset-2 outline-gray-500 drop-shadow-sm" : ""}`}
                                        onClick={() => handleColorSelectedEvent(color, variants.map((v) => ({ size: v.size, gender: v.gender })),
                                            variants[0].displayId)}
                                    >
                                    </div>
                                </div>
                            )
                        })}
                </div>

                {/* sizes */}
                <div className="flex flex-row mt-8">
                    {isCoupleCategory && <GenderSelector />}
                    {sizeList.map((size, index) => (
                        <SizeButton key={index} isAvailable={colorSelected === "" ||
                            availableSizeList.includes(size)} size={size} />
                    ))}
                </div>

                {/* add to chart */}
                <div className="flex px-8 bg-buttonMain w-82 py-1.5 text-white rounded-md items-center mt-7
                    justify-center text-lg cursor-pointer hover:bg-gray-800 drop-shadow-lg">
                    Add To Cart
                </div>
            </div>

        </div>
    )
}