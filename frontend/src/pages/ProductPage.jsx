import { useLoaderData } from "react-router"
import { useEffect, useState } from "react";
import { LeftImageSection } from "../components/product/LeftImageSection";
import { RightProductIntroSection } from "../components/product/RightProductIntroSection";
import { resetProductPageGlobalState, setLargeImageDisplay, setLeftImageSelected, setAlert } from "../store/features/productPageSlice";
import { useDispatch, useSelector } from "react-redux";
import { ReviewSection } from "../components/product/ReviewSection";
import { setFavoriteList } from "../store/features/favoriteSlice";
import { AlertCom } from "../components/AlertCom";
import { usePageMeta } from "../components/usePageMeta";
import { fetchProductByProductId } from "../api/fetchProductByProductId";
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton"
import { AIAgentButton } from "../components/sideButtons/AiAgentButton"
import { fetchFavoriteList } from "../api/fetchFavoriteList";
import { addFavoriteFromFavoriteList } from "../api/addFavorite";
import { removeFavoriteFromFavoriteList } from "../api/removeFavorite";

export const ProductPage = () => {

    const [data, setData] = useState(useLoaderData());
    const language = useSelector((state) => state.language.language);
    const [dataLanguage, setDataLanguage] = useState(language);
    const productDisplayDtoList = data.productDisplayDtoList;
    const dispatch = useDispatch();
    const [reviewList, setReviewList] = useState(data.reviewList);
    const [reviewPage, setReviewPage] = useState(0);
    const [avgRating, setAvgRating] = useState(data.avgRating);
    const [totalReviewPage, setTotalReviewPage] = useState(Math.ceil(data.reviewCount / 3))

    const isEnglish = language === 'en';

    useEffect(() => {
        window.scrollTo({
          top: 0,
        });
      }, []);
      

    useEffect(() => {
        dispatch(resetProductPageGlobalState());
        const primaryImageProductDispalyDto = productDisplayDtoList.find((display) => display.isPrimary === true);
        dispatch(setLargeImageDisplay(primaryImageProductDispalyDto.url));
        dispatch(setLeftImageSelected(primaryImageProductDispalyDto.id));
    }, [])

    const isLoggedIn = useSelector((state) => state.auth.isLogin)
    const favoritesList = useSelector((state) => state.favorite.favoritesList);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                if (isLoggedIn) {
                    console.log("Fetching favorites list...");
                    const favorites = await fetchFavoriteList();
                    console.log("Fetched favorites:", favorites);
                    dispatch(setFavoriteList(favorites));
                }
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        }
        loadFavorites();
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        const loadNewLangProduct = async () => {
            if (language === dataLanguage) return;
            const response = await fetchProductByProductId(data.productId, language);
            setData(response)
            setDataLanguage(language);
        }
        loadNewLangProduct();
    }, [language])

    const alert = useSelector((state) => state.productPageGlobalState.alert);

    usePageMeta({ titleEn: data.name, titleZh: data.name, isEnglish: isEnglish });

    const handleAddToFavorite = async () => {
        if (!isLoggedIn) {
            dispatch(setAlert({
                status: "warning",
                message: isEnglish ? "Please login first" : "請先登入"
            }));
            return;
        }

        try {
            const isInFavorites = favoritesList.some(favorite => favorite.productId === data.productId);
            
            if (isInFavorites) {
                await removeFavoriteFromFavoriteList(data.productId);
                const updatedFavorites = favoritesList.filter(favorite => favorite.productId !== data.productId);
                dispatch(setFavoriteList(updatedFavorites));
                dispatch(setAlert({
                    status: "success",
                    message: isEnglish ? "Removed from favorites" : "已從收藏清單中移除"
                }));
            } else {
                await addFavoriteFromFavoriteList(data.productId);
                const newFavorite = {
                    productId: data.productId,
                    name: data.name,
                    price: data.price,
                    imageUrl: productDisplayDtoList[0].url
                };
                dispatch(setFavoriteList([...favoritesList, newFavorite]));
                dispatch(setAlert({
                    status: "success",
                    message: isEnglish ? "Added to favorites" : "已加入收藏清單"
                }));
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
            dispatch(setAlert({
                status: "error",
                message: isEnglish ? "Failed to update favorites" : "更新收藏清單失敗"
            }));
        }
    };

    return (
        <div className="w-full h-auto flex justify-center items-center font-inter">

            {/* Desktop version */}
            <div className="hidden sm:flex container mt-10  flex-col justify-center items-center">

                <div className="w-300 mb-9">
                    {alert.status !== "" && <AlertCom message={alert.message} type={alert.type} />}
                </div>


                {/* product detail */}
                <div className="w-full flex flex-row h-130">
                    {/* left images area */}
                    <div className="basis-1/2 flex justify-end">
                        <LeftImageSection 
                            productDisplayDtoList={productDisplayDtoList}
                            productId={data.productId}
                            onAddToFavorite={handleAddToFavorite}
                        />
                    </div>


                    {/* right product Intro area */}
                    <div className="basis-1/2 px-28 py-5 flex items-center">
                        <RightProductIntroSection data={data} isEnglish={isEnglish} avgRating={avgRating}/>
                    </div>

                </div>

                <div className="flex flex-col justify-center items-center mt-23">
                    {/* proudct description */}
                    <div className="border border-gray-300 px-15 w-350 h-30 pt-8 rounded-lg">
                        <div className="font-bold">{isEnglish ? "Product Description" : "產品描述"}</div>
                        <div className="mt-2">{data.description}</div>
                    </div>

                    <div className="border border-gray-300 px-15 pb-12 w-350 pt-8 rounded-lg mt-12">
                    <ReviewSection productId={data.productId} reviewPage={reviewPage} setReviewPage={setReviewPage} avgRating={avgRating} reviewList={reviewList} setReviewList={setReviewList} 
                        setAvgRating={setAvgRating} totalReviewPage={totalReviewPage} setTotalReviewPage={setTotalReviewPage}/>
                    </div>

                </div>
            </div>

            {/* mobile version */}
            <div className="sm:hidden">
                <div className="flex flex-col">
                    <div className="px-4">
                        <LeftImageSection 
                            productDisplayDtoList={productDisplayDtoList}
                            productId={data.productId}
                            onAddToFavorite={handleAddToFavorite}
                        />
                    </div>
                    <div className="mt-8 mx-10"><RightProductIntroSection data={data} isEnglish={isEnglish} avgRating={avgRating}/></div>
                    <div className="mt-15 border border-gray-300 px-8 mx-10 pt-7 pb-8 rounded-lg">
                        <div className="font-bold">{isEnglish ? "Product Description" : "產品描述"}</div>
                        <div className="mt-2">{data.description}</div>
                    </div>

                    <div className="border border-gray-300 rounded-lg mt-12 px-7 pt-7 mx-10 pb-8">
                        <ReviewSection productId={data.productId} reviewPage={reviewPage} setReviewPage={setReviewPage} avgRating={data.avgRating} reviewList={reviewList} setReviewList={setReviewList} setAvgRating={setAvgRating} />
                    </div>
                </div>

            </div>

            <div className="relative z-30">
                <WindowScrollToTopButton />
                <AIAgentButton />
            </div>
        </div>
    )
}