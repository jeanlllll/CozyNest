import { useNavigate } from "react-router";
import { useEffect } from "react";
import { fitlersToStringParams } from "../../Helper/filtersToStringParams";


export const Pagination = ({ currentPage, totalPages, category, filters }) => {
    const navigate = useNavigate();

    const handlePageChange = async (page) => {
        const queryString = await fitlersToStringParams({ category, filters });
        navigate(`/category/${category}?page=${page}&${queryString}`);
        window.scrollTo({ top: 0});
    };

    const pages = [];

    for (let i = 0; i < totalPages; i++) {
        const pageNumber = i + 1;
        pages.push(
            <button
                onClick={() => handlePageChange(i)}
                key={pageNumber}
                className={`px-4 py-1 mx-2 rounded-lg cursor-pointer transition delay-50 hover:bg-gray-300 hover:text-white ${currentPage + 1 === pageNumber ? "bg-black text-white" : "text-gray-800"}`}
            >
                {pageNumber}
            </button>

        )
    }

    return (
        <div className="flex items-center justify-center">

            {/* Previous button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="cursor-pointer text-black disabled:text-gray-300"

            >
                ← Previous
            </button>

            {/* pages */}
            <div className="mx-15">
                {pages}
            </div>


            {/* Next button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages-1}
                className="cursor-pointer text-black disabled:text-gray-300"
            >
                Next →
            </button>
        </div>
    )
}