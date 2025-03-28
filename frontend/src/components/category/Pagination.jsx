import { useNavigate } from "react-router";
import { useEffect } from "react";
import { fitlersToStringParams } from "../../Helper/filtersToStringParams";
import { PageNumberButton } from "./pageNumberButton";

export const Pagination = ({ currentPage, totalPages, category, filters }) => {
    const navigate = useNavigate();

    const handlePageChange = async (page) => {
        const queryString = await fitlersToStringParams({ category, filters });
        navigate(`/category/${category}?page=${page}&${queryString}`);
        window.scrollTo({ top: 0 });
    };

    const maxVisibleButton = 7;

    const pages = [];

    if (totalPages <= maxVisibleButton) {
        for (let i = 0; i < totalPages; i++) {
            pages.push(<PageNumberButton currentPage={currentPage} pageNumber={i} filters={filters} category={category} />)
        }
    } else {
        pages.push(<PageNumberButton currentPage={currentPage} pageNumber={1} filters={filters} category={category} />)
        pages.push(<PageNumberButton currentPage={currentPage} pageNumber={"..."} filters={filters} category={category} />)
        pages.push(<PageNumberButton currentPage={currentPage} pageNumber={currentPage - 1} filters={filters} category={category} />)
        pages.push(<PageNumberButton currentPage={currentPage} pageNumber={currentPage} filters={filters} category={category} />)
        pages.push(<PageNumberButton currentPage={currentPage} pageNumber={currentPage + 1} filters={filters} category={category} />)
        pages.push(<PageNumberButton currentPage={currentPage} pageNumber={"..."} filters={filters} category={category} />)
        pages.push(<PageNumberButton currentPage={currentPage} pageNumber={totalPages - 1} filters={filters} category={category} />)
    }

    return (
        <div className="flex items-center justify-center">

            {/* deskstop version */}
            <div className="hidden sm:flex flex-row">
                {/* Previous button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="cursor-pointer text-black disabled:text-gray-300"

                >
                    ← Previous
                </button>

                {/* pages */}
                <div className="mx-2 sm:mx-15">
                    {pages}
                </div>


                {/* Next button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="cursor-pointer text-black  disabled:text-gray-300"
                >
                    Next →
                </button>
            </div>


            {/* mobile version */}
            <div className="sm:hidden mr-2 py-5 w-60 flex justify-between">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="cursor-pointer text-black text-base disabled:text-gray-300 base-1/3"
                >
                    ← Prev
                </button>

                <div className="px-8 text-base flex justify-center base-1/3">
                    {currentPage + 1}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="cursor-pointer text-black text-base disabled:text-gray-300 base-1/3"
                >
                    Next →
                </button>
            </div>

        </div>
    )
}