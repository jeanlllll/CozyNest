import { useNavigate } from "react-router";
import { fitlersToStringParams } from "../../Helper/filtersToStringParams";

export const PageNumberButton = ({currentPage, pageNumber, filters, category}) => {
    const navigate = useNavigate();
    
    const handlePageChange = async (page) => {
        const queryString = await fitlersToStringParams({ category, filters });
        navigate(`/category/${category}?page=${page}&${queryString}`);
        window.scrollTo({ top: 0});
    };

    if (pageNumber === "...") {
        return (
            <span key={`ellipsis-${Math.random()}`} className="px-4 py-1 mx-2 text-gray-500">...</span>
        );
    }

    return (
        <button
            onClick={() => handlePageChange(pageNumber)}
            key={pageNumber}
            className={`px-4 py-1 mx-2 rounded-lg cursor-pointer transition delay-50 hover:bg-gray-300 hover:text-white ${currentPage === pageNumber ? "bg-black text-white" : "text-gray-800"}`}
        >
            {pageNumber+1}
        </button>
    )
}