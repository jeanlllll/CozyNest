import { useDispatch, useSelector } from "react-redux"
import { HeartIcon } from "../../assets/icons/HeartIcon"
import { setLargeImageDisplay, setLeftImageSelected } from "../../store/features/productPageSlice"
import { useEffect } from "react"

export const LeftImageSection = ({ productDisplayDtoList }) => {

    const largeImageDisplay = useSelector((state) => state.productPageGlobalState.largeImageDisplay)
    const leftImageSelected = useSelector((state) => state.productPageGlobalState.leftImageSelected)
    const dispatch = useDispatch();

    const handleLeftImageSelectEvent = (productDisplayDto) => {
        dispatch(setLargeImageDisplay(productDisplayDto.url));
        dispatch(setLeftImageSelected(productDisplayDto.id));
    }

    return (
        <div className="basis-1/2 flex flex-rows items-center justify-end">
            <div className="flex flex-col mr-10">
                {productDisplayDtoList.map((productDisplayDto, index) => {
                    return (
                        <div key={index}
                            className={`border-2 border-gray-100 w-14 h-14 cursor-pointer m-1 rounded 
                            ${productDisplayDto.id === leftImageSelected ? "ring-2 ring-gray-500" : ""}`}
                            onClick={() => handleLeftImageSelectEvent(productDisplayDto)}
                        >
                            <img src={productDisplayDto.url} alt="" />
                        </div>
                    )
                })}
            </div>

            <div className="relative">
                <img src={largeImageDisplay} alt="" className="w-130 h-130 cursor-pointer"
                    onClick={() => window.open(largeImageDisplay, "_blank")} />

                <div className="absolute top-2 right-2 bg-buttonMain opacity-50 p-2 rounded-full flex items-center 
                            justify-center cursor-pointer hover:opacity-100 drop-shadow-xl">
                    <HeartIcon />
                </div>
            </div>
        </div>
    )
}