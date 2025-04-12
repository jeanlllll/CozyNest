import { StarRating } from "../starRating/StarRating"
import { useState } from "react";
import { ReviewModal } from "../../components/product/ReviewModal"
import { ReviewPageSection } from "./ReviewPageSection";
import { fetchReviewsByPageNSortUrl } from "../../api/fetchReviewByPageNSort";
import { useSelector } from "react-redux";

export const ReviewSection = ({ productId, reviewPage, setReviewPage, avgRating, reviewList, setReviewList, setAvgRating, totalReviewPage, setTotalReviewPage }) => {
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en"
    const haveReview = reviewList.length > 0

    const [reviewSortBy, setReviewSortBy] = useState("createdOn");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleSortByNPageRequest = async (type) => {
        let newPage = reviewPage;
        let newSortBy = reviewSortBy;

        if (type === "sortByRating") {
            newSortBy = "rating";
            newPage = 0;
        } else if (type === "sortByCreatedOn") {
            newSortBy = "createdOn";
            newPage = 0;
        } else if (type === "prevPage") {
            if (newPage === 0) return;
            newPage -= 1;
        } else if (type === "nextPage") {
            if (newPage === totalReviewPage - 1) return;
            newPage += 1;
        }

        const response = await fetchReviewsByPageNSortUrl(productId, newPage, 3, newSortBy);
        if (response.status === 200) {
            setReviewSortBy(newSortBy);
            setReviewPage(newPage)
            setReviewList(response.data);
        }
    }

    return (
        <div>
            {/* desktop verison */}
            <div className="hidden sm:block">
                <div className="flex flex-row justify-between items-center">
                    <div className="">
                        <h1 className="font-bold text-lg ">{isEnglish ? "Reviews" : "評論"}</h1>
                        <div className="mt-4 text-md">
                            {haveReview ? (isEnglish ? `Total Rating ${(avgRating || 0).toFixed(2)} ` : `總評分 ${(avgRating || 0).toFixed(2)} `) : (isEnglish ? "No Reviews Given Yet" : "暫無評論")}
                            <div className="pt-1"><StarRating rating={haveReview ? avgRating : 0} isReadOnly={true} /></div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex justify-end">
                            <div className="border bg-buttonMain px-6 py-2 rounded-md text-white hover:bg-gray-800 cursor-pointer text-md text-center drop-shadow-lg"
                                onClick={() => setIsReviewModalOpen(true)}
                            >
                                {isEnglish ? "Leave Your Review" : "留下您的評論"}
                            </div>
                        </div>

                        <div className="flex flex-row mt-5 gap-4">
                            <div className="text-buttonMain text-md flex items-center px-5">
                                {isEnglish ? "Sort By" : "排序依據"}
                            </div>
                            <div className={` px-4 py-2 rounded-md  cursor-pointer text-md drop-shadow-lg 
                                ${reviewSortBy === "createdOn" ? "bg-buttonMain text-white" : "bg-buttonThird text-buttonMain hover:bg-buttonMain hover:text-white"}`}
                                onClick={() => handleSortByNPageRequest("sortByCreatedOn")}
                            >
                                {isEnglish ? "Latest Review" : "最新評論"}
                            </div>
                            <div className={` px-4 py-2 rounded-md  cursor-pointer text-md drop-shadow-lg 
                                ${reviewSortBy === "rating" ? "bg-buttonMain text-white" : "bg-buttonThird text-buttonMain hover:bg-buttonMain hover:text-white"}`}
                                onClick={() => handleSortByNPageRequest("sortByRating")}
                            >
                                {isEnglish ? "Rating" : "評分"}
                            </div>
                        </div>

                        <ReviewModal
                            isOpen={isReviewModalOpen}
                            onClose={() => setIsReviewModalOpen(false)}
                            setReviewList={setReviewList}
                            setAvgRating={setAvgRating}
                            setTotalReviewPage={setTotalReviewPage}
                        />
                    </div>
                </div >

                {haveReview && <div className="h-89 mt-14">
                    <ReviewPageSection reviewList={reviewList} handleSortByNPageRequest={handleSortByNPageRequest} reviewPage={reviewPage} totalReviewPage={totalReviewPage} />
                </div>}
            </div>

            {/* mobile version */}
            <div className="sm:hidden">
                <div>
                    <h1 className="font-bold text-lg ">{isEnglish ? "Reviews" : "評論"}</h1>
                    <div className="mt-2 text-md">
                        {haveReview ? (isEnglish ? `Total Rating ${(avgRating || 0).toFixed(2)} ` : `總評分 ${(avgRating || 0).toFixed(2)} `) : (isEnglish ? "No Reviews Given Yet" : "暫無評論")}
                        <div className=""><StarRating rating={haveReview ? avgRating : 0} isReadOnly={true} /></div>
                    </div>

                    <div className="border bg-buttonMain px-6 py-2 mt-2 rounded-md text-white hover:bg-gray-800 cursor-pointer text-md text-center drop-shadow-lg"
                        onClick={() => setIsReviewModalOpen(true)}
                    >
                        {isEnglish ? "Leave Your Review" : "留下您的評論"}
                    </div>

                    {haveReview && <div>
                        <div className="text-buttonMain text-md flex items-center px-2 mt-8">
                            {isEnglish ? "Sort By" : "排序依據"}
                        </div>
                        <div className="flex flex-col mt-1 gap-4">
                            <div className="flex flex-row gap-5">
                                <div className={` px-4 py-2 rounded-md  cursor-pointer text-md drop-shadow-lg 
                                    ${reviewSortBy === "createdOn" ? "bg-buttonMain text-white" : "bg-buttonThird text-buttonMain hover:bg-buttonMain hover:text-white"}`}
                                    onClick={() => handleSortByNPageRequest("sortByCreatedOn")}
                                >
                                    {isEnglish ? "Latest Review" : "最新評論"}
                                </div>
                                <div className={` px-4 py-2 rounded-md  cursor-pointer text-md drop-shadow-lg 
                                    ${reviewSortBy === "rating" ? "bg-buttonMain text-white" : "bg-buttonThird text-buttonMain hover:bg-buttonMain hover:text-white"}`}
                                    onClick={() => handleSortByNPageRequest("sortByRating")}
                                >
                                    {isEnglish ? "Rating" : "評分"}
                                </div>
                            </div>

                            <div className="mt-6">
                                <ReviewPageSection reviewList={reviewList} handleSortByNPageRequest={handleSortByNPageRequest} reviewPage={reviewPage} totalReviewPage={totalReviewPage} isEnglish={isEnglish}/>
                            </div>
                        </div>
                    </div>}

                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        setReviewList={setReviewList}
                        setAvgRating={setAvgRating}
                        setTotalReviewPage={setTotalReviewPage}
                    />
                </div>
            </div>
        </div>
    )
}
