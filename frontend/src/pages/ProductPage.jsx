import { useLoaderData } from "react-router"
import { useEffect, useState } from "react";
import { LeftImageSection } from "../components/product/LeftImageSection";
import { RightProductIntroSection } from "../components/product/RightProductIntroSection";
import { resetProductPageGlobalState, setLargeImageDisplay, setLeftImageSelected } from "../store/features/productPageSlice";
import { useDispatch, useSelector } from "react-redux";
import { ReviewSection } from "../components/product/ReviewSection";
import { setFavoriteList } from "../store/features/favoriteSlice";
import { AlertCom } from "../components/AlertCom";

export const ProductPage = () => {

    const data = useLoaderData();
    const productDisplayDtoList = data.productDisplayDtoList;
    const dispatch = useDispatch();

    const language = useSelector((state) => state.language.language);
    const isEnglish = language === 'en';

    useEffect(() => {
        dispatch(resetProductPageGlobalState());
        const primaryImageProductDispalyDto = productDisplayDtoList.find((display) => display.isPrimary === true);
        dispatch(setLargeImageDisplay(primaryImageProductDispalyDto.url));
        dispatch(setLeftImageSelected(primaryImageProductDispalyDto.id));
    }, [])

    const isLoggedIn = useSelector((state) => state.login.isLoggedIn)
    const favoritesList = useSelector((state) => state.favorite.favoritesList);

    useEffect(() => {
        const loadFavorites = async () => {
            if (favoritesList === null && isLoggedIn) {
                const favoritesList = await fetchFavoriteList();
                dispatch(setFavoriteList(favoritesList));
            }
        }
        loadFavorites();
    }, [dispatch, isLoggedIn, favoritesList])

    const alert = useSelector((state) => state.productPageGlobalState.alert);

    return (
        <div className="w-full h-auto flex justify-center items-center font-inter">
            <div className="container mt-10 flex flex-col justify-center items-center">

                <div className="w-300 mb-9">
                    {alert.status !== "" && <AlertCom message={alert.message} type={alert.type} />}
                </div>


                {/* product detail */}
                <div className="w-full flex flex-row h-130">
                    {/* left images area */}
                    <LeftImageSection productDisplayDtoList={productDisplayDtoList} />

                    {/* right product Intro area */}
                    <div className="basis-1/2 px-23 py-5 flex">
                        <RightProductIntroSection data={data} isEnglish={isEnglish}/>
                    </div>

                </div>

                <div className="flex flex-col justify-center items-center mt-23">
                    {/* proudct description */}
                    <div className="border border-gray-300 px-15 w-350 h-30 pt-8 rounded-lg">
                        <div className="font-bold">{isEnglish ? "Product Description" : "產品描述"}</div>
                        <div className="mt-2">{data.description}</div>
                    </div>

                    <div className="border border-gray-300 px-15 pb-12 w-350 pt-8 rounded-lg mt-12">
                        <ReviewSection data={data} />
                    </div>

                </div>


            </div>
        </div>
    )
}