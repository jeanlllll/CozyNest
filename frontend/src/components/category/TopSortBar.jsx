import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setSortBy } from "../../store/features/filtersSlice";
import { DropDownMenu } from "./DropDownMenu";

export const TopSortBar = ({isEnglish, category}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters);

    const sortBy = filters.sortBy;
    
    const hanldeSortByOnClick = (sortCriteria) => {
        if (sortBy !== sortCriteria) {
            dispatch(setSortBy(sortCriteria))
        }
    }

    return (
        < div className = "flex flex-cols items-center mb-8 mt-7 justify-between" >

            <div className="ml-6">
                {/* search bar */}
                <div className="relative md:hidden lg:block flex">
                    <input type="text"
                        id="default-search"
                        className="block w-50 sm:w-60 p-2 ps-5 pr-10 text-sm text-gray-500 border border-gray-200 
                                rounded-full bg-white
                                focus:border-gray-400 focus:outline-none"
                        placeholder={isEnglish ? "Search" : "搜尋"}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                navigate(`/category/${category}?page=0&size=9`)
                            } else {
                                navigate(`/category/${category}?page=0&size=9&keywords=${encodeURIComponent(e.target.value)}`)
                            }
                        }}
                        required />

                    <div className="absolute flex items-center top-2.5 right-4 pointer-events-none">

                        <svg class="w-4 h-4 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>

                    </div>
                </div>
            </div>
            
            {/* Desktop version */}
            <div className="hidden sm:flex flex-row items-center">
                {/* sorting criteria */}
                <div className="mr-4 text-gray-500">
                    {isEnglish? "Sort by" : "排序方式"}
                </div>
                <div className={` ${sortBy==="sortByArrivalDateDesc" ? "bg-buttonMain text-white" : "bg-buttonThird"}
                                text-gray-800 rounded-lg px-4 py-1  mr-3 flex flex-row justify-between cursor-pointer hover:bg-buttonMain hover:text-white drop-shadow-sm
                                `}
                                onClick={()=> hanldeSortByOnClick("sortByArrivalDateDesc")}
                            
                >
                    {isEnglish? "New Arrival" : "最新上架"}
                </div>
                <div className={` ${sortBy==="sortByPriceAsc" ? "bg-buttonMain text-white" : "bg-buttonThird"}
                                text-gray-800 rounded-lg px-4 py-1  mr-3 flex flex-row justify-between cursor-pointer hover:bg-buttonMain hover:text-white drop-shadow-sm
                                `}
                                onClick={()=> hanldeSortByOnClick("sortByPriceAsc")}
                            
                >
                    {isEnglish? "Price ascending" : "價格：由低至高"}
                </div>

                <div className={` ${sortBy==="sortByPriceDesc" ? "bg-buttonMain text-white" : "bg-buttonThird"}
                                text-gray-800 rounded-lg px-4 py-1  mr-3 flex flex-row justify-between cursor-pointer hover:bg-buttonMain hover:text-white drop-shadow-sm
                                `}
                                onClick={()=> hanldeSortByOnClick("sortByPriceDesc")}   
                >
                    {isEnglish? "Price descending": "價格：由高至低"}
                </div>

                <div className={` ${sortBy==="sortByRatingDesc" ? "bg-buttonMain text-white" : "bg-buttonThird"}
                                text-gray-800 rounded-lg px-4 py-1  mr-3 flex flex-row justify-between cursor-pointer hover:bg-buttonMain hover:text-white drop-shadow-sm
                                `}
                                onClick={()=> hanldeSortByOnClick("sortByRatingDesc")}   
                >
                    {isEnglish? "Rating" : "評價"}
                </div>
            </div>
            
            {/* Mobile version */}
            <div className="sm:hidden mr-5">
                <DropDownMenu isEnglish={isEnglish} category={category}/>
            </div>
    </div>
    )
}