import { useNavigate, useParams, useSearchParams } from "react-router"
import { FilterSideBar } from "../components/category/FilterSideBar";
import { categoryChinese, categoryType } from "../assets/data/data";
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
import { fetchFavoriteList } from "../api/fetchFavoriteList";
import { setFavoriteList } from "../store/features/favoriteSlice";
import { useIsMobile } from "../components/category/useIsMobile";
import { usePageMeta } from "../components/usePageMeta";

export const CategoryPage = (request) => {
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en";

    const { category } = useParams();
    const categoryTypeList = categoryType[category.toLowerCase()];

    const data = useLoaderData();
    const totalPages = data.totalPages;
    const productList = data.content;

    const dispatch = useDispatch();

    const filters = useSelector((state) => state.filters)

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 0;
    const lastPage = totalPages - 1;
    const rowNeededForGrid = page === lastPage ? 'grid-rows-1' : 'grid-rows-3'
    const isNoProductFound = data.totalElements === 0 ? true : false;

    const isLoggedIn = useSelector((state) => state.auth.isLogin)
    const favoritesList = useSelector((state) => state.favorite.favoritesList);

    const isMobile = useIsMobile(768);

    useEffect(() => {
        if (isLoggedIn && (!favoritesList || favoritesList.length === 0)) {
            fetchFavoriteList().then((list) => {
                dispatch(setFavoriteList(list))
            })
        }
    }, [dispatch, isLoggedIn])

    useEffect(() => {
        dispatch(resetFilters());
        dispatch(setCategoryTypes(categoryTypeList));
        dispatch(setSizes(sizeList));
    }, [category]);

    usePageMeta({titleEn: category.charAt(0).toUpperCase() + category.slice(1), titleZh: categoryChinese[category.toUpperCase()], isEnglish: isEnglish})

    
    return (
        <div className="w-full h-auto flex justify-center">
            <div className="container flex-col">

                {/* desktop version */}
                {!isMobile && <div className="hidden sm:flex flex-row">

                    {/* filter side bar */}
                    <div className="border border-gray-300 h-160 rounded-lg mt-21 mr-15 basis-2/12">
                        <FilterSideBar categoryTypeList={categoryTypeList} sizeList={sizeList} category={category} isEnglish={isEnglish} isMobile={isMobile}/>
                    </div>


                    <div className="basis-8/10 flex flex-col">

                        <TopSortBar isEnglish={isEnglish} category={category} />

                        {/* product display grid */}
                        <div className={`grid grid-cols-3 ${rowNeededForGrid} gap-10 pl-4 mt-3`}>
                            {isNoProductFound && <div className="pt-5 pl-6 text-lg text-gray-700 flex ">No matching products found.</div>}

                            {productList.map((product, index) => {
                                const productImage = product.productDisplayDtoList.find((img) => img.isPrimary)?.url ||
                                    product?.productDisplayDtoList?.[0]?.url;
                                return (
                                    <Card key={index} product={product} productImage={productImage} isEnglish={isEnglish} />
                                )
                            })}
                        </div>
                    </div>
                </div>}

                {/* mobile version */}
                {isMobile && <div className="sm:hidden">
                    <div>
                        <TopSortBar isEnglish={isEnglish} category={category} />
                        <FilterSideBar categoryTypeList={categoryTypeList} sizeList={sizeList} category={category} isEnglish={isEnglish} isMobile={isMobile}/>
                    </div>

                    {/* product display */}
                    <div className="grid grid-row-9 grid-col-1 px-6">
                        {isNoProductFound && <div className="pt-5 pl-6 text-lg text-gray-700 flex ">No matching products found.</div>}

                        {productList.map((product, index) => {
                            const productImage = product.productDisplayDtoList.find((img) => img.isPrimary)?.url ||
                                product?.productDisplayDtoList?.[0]?.url;
                            const productName = product.productTranslationDtoList.find((item) => item.languageCode === language)?.productName || "Unnamed Product";
                            return (
                                <div className="mt-7"><Card key={index} product={product} productImage={productImage} productName={productName} /></div>
                            )
                        })}
                    </div>
                </div>}

                <div className="mt-6 sm:mt-22 sm:mb-7">
                    <Pagination currentPage={data.number} totalPages={totalPages} category={category} filters={filters} />
                </div>

                <div className="relative z-30">
                    <WindowScrollToTopButton />
                    <AIAgentButton />
                </div>
            </div>

        </div>


    )
}