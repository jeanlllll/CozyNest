import { StarRating } from "../starRating/StarRating";
import { LeftArrowIcon } from "../../assets/icons/LeftArrowIcon";
import { RightArrowIcon } from "../../assets/icons/RightArrowIcon";
import { useDispatch, useSelector } from "react-redux";

export const ReviewPageSection = ({ data }) => {
    const reviewList = data.reviewList;
    const review = useSelector((state) => state.review.reviewPage);

    return (
        <div className="w-full flex flex-row h-full items-center px-2 justify-between">
            <div className="p-4 rounded-full flex items-center justify-center cursor-pointer">
                <LeftArrowIcon />
            </div>

            <div className="flex flex-rows h-full justify-center">
                {data.reviewList.map((review, index) => {
                    return (
                        <div className="border basis-4/12 border-gray-200 rounded-lg mx-8 px-8 pt-5 pb-1 flex flex-col ring-3 
                         ring-buttonMain">
                            <div className="basis-1/7 font-semibold text-lg shadow-none">Rating: {review.rating.toFixed(1)} </div>
                            <div className="basis-1/7"><StarRating rate={review.rating} isReadOnly={true} /></div>
                            <div className="basis-4/7 mt-4 shadow-none">{review.comment}</div>
                            <div className="basis-1/7 text-md shadow-none">
                                <div className="text-gray-800 font-bold">{review.userName}</div>
                                <div className="mt-1 mb-5 text-buttonSecond">{review.createdOn}</div>
                            </div>
                        </div>
                    )
                })}
            </div>


            <div className="p-4 rounded-full flex items-center justify-center cursor-pointer">
                <RightArrowIcon />
            </div>
        </div>
    )
}
