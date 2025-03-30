import { StarRating } from "../starRating/StarRating"
import { useState } from "react";
import { ReviewModal } from "../../components/product/ReviewModal"
import { ReviewPageSection } from "./ReviewPageSection";

export const ReviewSection = ({ data }) => {

    const haveReview = data.reviewList.length > 0

    const [reviewSortBy, setReviewSortBy] = useState();

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);


    return (
        <div>
            <div className="flex flex-row justify-between items-center">
                <div className="">
                    <h1 className="font-bold text-lg ">Reviews</h1>
                    <div className="mt-4 text-md">
                        {haveReview ? `Total Rating ${data.avgRating} ` : "No Reviews Given Yet"}
                        <div className="pt-1"><StarRating rate={haveReview ? data.avgRating : 0} isReadOnly={true} /></div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-end">
                        <div className="border bg-buttonMain px-6 py-2 rounded-md text-white hover:bg-gray-800 cursor-pointer text-md text-center drop-shadow-lg"
                            onClick={() => setIsReviewModalOpen(true)}
                        >
                            Leave Your Review
                        </div>
                    </div>


                    <div className="flex flex-row mt-5 gap-4">
                        <div className="text-buttonMain text-md flex items-center px-5">
                            Sort By
                        </div>
                        <div className="bg-buttonThird px-4 py-2 rounded-md text-buttonMain cursor-pointer text-md drop-shadow-lg hover:bg-buttonMain hover:text-white">
                            Latest Review
                        </div>
                        <div className="bg-buttonThird px-4 py-2 rounded-md text-buttonMain cursor-pointer text-md drop-shadow-lg hover:bg-buttonMain hover:text-white">
                            Rating
                        </div>
                    </div>

                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                    />
                </div>
            </div >

            {haveReview && <div className="h-89 mt-14">
                <ReviewPageSection data={data} />
            </div>}
        </div>


    )
}