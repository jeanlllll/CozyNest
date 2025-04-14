import { useDispatch, useSelector } from "react-redux"
import { HeartIcon } from "../assets/icons/HeartIcon"
import { setFavoriteList } from "../store/features/favoriteSlice"
import { addFavoriteFromFavoriteList } from "../api/addFavorite"
import { removeFavoriteFromFavoriteList } from "../api/removeFavorite"
import { useNavigate } from "react-router-dom"
import { setAlert } from "../store/features/productPageSlice"

export const HeartButton = ({ productId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLogin);
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === 'en';
    const favoritesList = useSelector((state) => state.favorite.favoritesList)

    let isAlreadyInFavoriteList = false;
    if (Array.isArray(favoritesList) && favoritesList.some((favorite) => favorite.productId === productId)) {
        isAlreadyInFavoriteList = true;
    }

    const handleHeartButtonOnClick = async (e) => {
        e.stopPropagation(); // Prevent event bubbling

        if (!isLoggedIn) {
            alert(isEnglish ? "Please login first" : "請先登入")
            navigate("/user/login");
            return;
        }

        let newFavoritesList = [];
        try {
            if (!isAlreadyInFavoriteList) {
                newFavoritesList = await addFavoriteFromFavoriteList(productId);
                dispatch(setAlert({
                    status: "success",
                    message: isEnglish ? "Added to favorites" : "已加入收藏",
                    type: "success"
                }));
            } else {
                newFavoritesList = await removeFavoriteFromFavoriteList(productId);
                dispatch(setAlert({
                    status: "success",
                    message: isEnglish ? "Removed from favorites" : "已從收藏中移除",
                    type: "success"
                }));
            }
            dispatch(setFavoriteList(newFavoritesList));

            // Clear alert after 3 seconds
            setTimeout(() => {
                dispatch(setAlert({ status: "", message: "", type: "" }));
            }, 3000);
        } catch (error) {
            dispatch(setAlert({
                status: "error",
                message: isEnglish ? "Operation failed" : "操作失敗",
                type: "error"
            }));
        }
    }

    return (
        <div className={`absolute top-1.5 right-1.5 bg-buttonMain ${isAlreadyInFavoriteList ? "opacity-100" : "opacity-30 hover:opacity-100"} p-2 rounded-full flex items-center justify-center 
        cursor-pointer drop-shadow-xl`}
            onClick={handleHeartButtonOnClick}
        >
            <HeartIcon />
        </div>
    )
}