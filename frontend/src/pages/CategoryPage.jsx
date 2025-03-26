import { useNavigate, useParams, useSearchParams } from "react-router"
import { FilterSideBar } from "../components/category/FilterSideBar";
import { categoryType } from "../assets/data/data";
import { sizeList } from "../assets/data/data";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { AIAgentButton } from "../components/sideButtons/AiAgentButton";
import { Pagination } from "../components/category/Pagination";
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton";
import { Card } from "../components/Card";
import { setCategoryTypes, setSizes } from "../store/features/filtersSlice";
import { useEffect } from "react";
import { TopSortBar } from "../components/category/TopSortBar";
import { resetFilters } from "../store/features/filtersSlice";

export const CategoryPage = (request) => {
    const language = useSelector((state) => state.language.language);
    const [isEnglish, setIsEnglish] = useState(false);

    const { category } = useParams();
    const categoryTypeList = categoryType[category];

    const data = useLoaderData();
    const totalPages = data.totalPages;
    const productList = data.content;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const filters = useSelector((state) => state.filters)
    const sortBy = filters.sortBy;

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 0;
    const lastPage = totalPages - 1;
    const rowNeededForGrid = page === lastPage ? 'grid-rows-1' : 'grid-rows-3'
    const isNoProductFound = data.totalElements === 0 ? true : false;

    useEffect(() => {
        dispatch(resetFilters());
    }, [category]);

    useEffect(() => {
        if (filters.categoryTypes.length === 0) {
            dispatch(setCategoryTypes(categoryTypeList));
        }
        if (filters.sizes.length === 0) {
            dispatch(setSizes(sizeList));
        }
    }, [dispatch, filters.category, filters.sizes, categoryTypeList, sizeList, language])

    return (
        <div className="w-full h-auto flex justify-center">
            <div className="container flex-col">
                <div className="flex flex-row">

                    {/* filter side bar */}
                    <div className="border border-gray-300 h-160 rounded-lg mt-21 mr-15 basis-2/12">
                        <FilterSideBar categoryTypeList={categoryTypeList} sizeList={sizeList} category={category} />
                    </div>


                    <div className="basis-8/10 flex flex-col">

                        <TopSortBar isEnglish={isEnglish} category={category} />

                        {/* product display grid */}
                        <div className={`grid grid-cols-3 ${rowNeededForGrid} gap-10 pl-4 mt-3`}>
                            {isNoProductFound && <div className="pt-5 pl-6 text-lg text-gray-700 flex ">No matching products found.</div>}

                            {productList.map((product, index) => {
                                const productImage = product.productDisplayDtoList.find((img) => img.isPrimary)?.url ||
                                    product?.productDisplayDtoList?.[0]?.url;
                                const productName = product.productTranslationDtoList.find((item) => item.languageCode === language)?.productName || "Unnamed Product";
                                return (
                                    <Card key={index} product={product} productImage={productImage} productName={productName} />
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-22 mb-7">
                    <Pagination currentPage={data.number} totalPages={totalPages} category={category} filters={filters} />
                </div>

                <div className="relative z-30">
                    <WindowScrollToTopButton />
                    <AIAgentButton />
                </div>

            </div>

        </div >


    )
}