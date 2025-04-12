import { StarRating } from "../starRating/StarRating";
import { LeftArrowIcon } from "../../assets/icons/LeftArrowIcon";
import { RightArrowIcon } from "../../assets/icons/RightArrowIcon";
import { useDispatch, useSelector } from "react-redux";

export const ReviewPageSection = ({ reviewList, handleSortByNPageRequest, reviewPage, totalReviewPage, isEnglish }) => {

    return (
        <div>
            {/* desktop version */}
            <div className="hidden sm:flex w-full flex-row h-full items-center px-2 justify-between">
                <div className={`basis-1/14 p-4 rounded-full flex items-center justify-center cursor-pointer ${reviewPage === 0 ? "text-gray-300" : "text-black"}`}
                    onClick={() => handleSortByNPageRequest("prevPage")}
                >
                    <LeftArrowIcon />
                </div>

                <div className="basis-12/14 grid grid-cols-3 gap-3 h-full">
                    {reviewList.length > 0 && reviewList.map((review, index) => {
                        return (
                            <div className="border basis-4/12 border-gray-200 rounded-lg mx-8 px-8 pt-5 pb-1 flex flex-col ring-3 
                         ring-buttonMain">
                                <div className="basis-1/7 font-semibold text-lg shadow-none">{isEnglish? "Rating:" : "評分"} {review.rating.toFixed(2)} </div>
                                <div className="basis-1/7"><StarRating rating={review.rating} isReadOnly={true} /></div>
                                <div className="basis-4/7 mt-4 text-lg shadow-none">{review.comment}</div>
                                <div className="basis-1/7 text-md shadow-none">
                                    <div className="text-gray-800 font-bold mt-35">{review.userName}</div>
                                    <div className="mt-1 mb-5 text-buttonSecond">{review.createdOn}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>


                <div className={`basis-1/14 p-4 rounded-full flex items-center justify-center cursor-pointer ${reviewPage === totalReviewPage - 1 ? "text-gray-300" : "text-black"}`}
                    onClick={() => handleSortByNPageRequest("nextPage")}>
                    <RightArrowIcon />
                </div>
            </div>

            {/* mobile version */}
            <div className="sm:hidden">
                <div className="grid grid-col-3 gap-6">
                    {reviewList.length > 0 && reviewList.map((review, index) => {
                        return (
                            <div className="border border-gray-200 mt-2 px-8 pt-5 pb-1 flex flex-col ring-2 
                         ring-gray-400">
                                <div className="font-semibold text-md shadow-none">Rating: {review.rating.toFixed(2)} </div>
                                <div className="mt-1"><StarRating rating={review.rating} isReadOnly={true} /></div>
                                <div className=" mt-2 shadow-none">{review.comment}</div>
                                <div className="text-md shadow-none">
                                    <div className="mt-12 text-gray-800 font-bold">{review.userName}</div>
                                    <div className="mt-1 mb-2 text-buttonSecond">{review.createdOn}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex flex-row mt-3 items-center justify-center">
                    <div className={`basis-1/14 p-4 rounded-full flex items-center justify-center cursor-pointer ${reviewPage === 0 ? "text-gray-300" : "text-black"}`}
                        onClick={() => handleSortByNPageRequest("prevPage")}
                    >
                        <LeftArrowIcon />
                    </div>

                    <div className={`basis-1/14 p-4 rounded-full flex items-center justify-center cursor-pointer ${reviewPage === totalReviewPage - 1 ? "text-gray-300" : "text-black"}`}
                        onClick={() => handleSortByNPageRequest("nextPage")}>
                        <RightArrowIcon />
                    </div>
                </div>
            </div>
        </div>

    )
}
