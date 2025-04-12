import { useState } from "react";
import { StarRating } from "../starRating/StarRating"; // Your custom component
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { postProductReview } from "../../api/postProductReview";
import { useParams } from "react-router";


export const ReviewModal = ({ isOpen, onClose, setReviewList, setAvgRating, setTotalReviewPage }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const { productId } = useParams();

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (isOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
            return () => {
                document.body.style.overflow = "auto"
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmitReview = async () => {
        try {
            if (rating === 0 || comment.trim() === "") {
                alert("Please provide a rating and comment before submitting.");
                return;
            }
            console.log(rating, comment, productId)
            const response = await postProductReview(rating, comment, productId);
            if (response.status === 200) {
                setReviewList(response.data.reviewDtoPage.content);
                setAvgRating(response.data.avgRating)
                setComment("");
                setRating(0);
                setTotalReviewPage(Math.ceil(response.data.reviewCount / 3))
                alert("Review Added");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            alert("Failed to submit review. Please try again later.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-md p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-4xl cursor-pointer"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>

                {/* Rating */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Your Rating</label>
                    <StarRating rating={rating} isReadOnly={false} setRating={setRating} />
                </div>

                {/* Comment Input */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Your Comment</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-buttonMain"
                        rows={4}
                        placeholder="Write your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    className="bg-buttonMain text-white px-4 py-2 rounded hover:bg-gray-800 w-full cursor-pointer"
                    onClick={() => {
                        handleSubmitReview();
                        onClose(); // Close after submit
                    }}
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};
