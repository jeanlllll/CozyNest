import { EntireHeader } from "../components/header/EntireHeader"
import { EntireFooter } from "../components/footer/EntireFooter"
import { useLoaderData, useNavigate } from "react-router"
import { Card } from "../components/Card"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { setFavoriteList, resetFavoritePage } from "../store/features/favoriteSlice"
import { PaginationFav } from "../components/category/PaginationFav"
import { useMemo } from "react"
import { usePageMeta } from "../components/usePageMeta"
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"

export const FavoritesPage = () => {

    const itemsPerPage = 8;

    const dispatch = useDispatch();
    const data = useLoaderData();
    const navigate = useNavigate();

    const language = useSelector((state) => state.language.language);
    const isEnglish = language === 'en';
    const currentPage = useSelector((state) => state.favorite.favoritePage)

    usePageMeta({titleEn: "Favorites", titleZh: "我的最愛", isEnglish: isEnglish })

    useEffect(() => {
        dispatch(setFavoriteList(data));
        dispatch(resetFavoritePage());
    }, [dispatch, data]);

    const favoriteList = useSelector((state) => state.favorite.favoritesList)

    useEffect(() => {
        const maxValidPage = Math.floor((favoriteList.length - 1) / itemsPerPage);
        if (currentPage > maxValidPage) {
            dispatch(resetFavoritePage());
        }
    }, [favoriteList, currentPage, dispatch]);

    const handleReturnToHomePageEvent = () => {
        navigate("/")
    }

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const displayList = useMemo(() => {
        return Array.isArray(favoriteList) ? favoriteList : [];
    }, [favoriteList]);

    const itemsToDisplay = useMemo(() => {
        return displayList.slice(startIndex, endIndex);
    }, [displayList, startIndex, endIndex]);

    const totalPage = Math.ceil(displayList.length / itemsPerPage);

    const gridRow = itemsToDisplay.length <= 4 ? "grid-rows-1" : "grid-rows-2"; 

    return (
        <div className="min-h-dvh h-dvh flex flex-col font-inter">
            <div className="relative z-20">
                <EntireHeader needCategory={true} needPromotionBar={true} />
            </div>

            <div className="flex-1 w-full flex items-center justify-center mt-8 sm:mt-12 relative z-10">
                <div className=" container flex flex-col items-center  justify-center">
                    <div className="mb-3 sm:mb-9 text-3xl font-bold text-buttonMain">
                        {isEnglish? "Favorites" : "我的最愛"}
                    </div>
                    {data.length > 0 && <div className={`grid px-8 sm:px-0 ${gridRow} sm:grid-cols-4 gap-10`}>
                        {itemsToDisplay.map((item) => {
                            const productUrl = item.productDisplayDto.find((dto) => dto.isPrimary === true).url;
                            return (
                                <Card product={item} productImage={productUrl} isEnglish={isEnglish} />
                            )
                        })}
                    </div>}

                    {favoriteList.length === 0 &&
                        <div className="text-gray-600 flex flex-col justify-center text-center">
                            <h1 className="font-bold text-lg">No items in Favorites Yet.</h1>
                            <div>
                                <button className="mt-4 px-6 py-1.5 text-lg bg-buttonMain text-white rounded-md cursor-pointer"
                                    onClick={() => handleReturnToHomePageEvent()}
                                >Return To Home Page</button>
                            </div>
                        </div>}

                    {(favoriteList.length !== 0) && <div className="mt-17 mb-4">
                        <PaginationFav totalPage={totalPage} />
                    </div>}

                </div>
            </div>

            <div>
                <EntireFooter />
            </div>
            
            <div className="relative z-30">
                <WindowScrollToTopButton />
                <AIAgentButton />
            </div>
        </div >
    )
}

