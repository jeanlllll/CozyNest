import { useDispatch, useSelector } from "react-redux"
import { HeartIcon } from "../assets/icons/HeartIcon"
import { setFavoriteList } from "../store/features/favoriteSlice"
import { addFavoriteFromFavoriteList } from "../api/addFavorite"
import { removeFavoriteFromFavoriteList } from "../api/removeFavorite"

export const HeartButton = ({ productId }) => {
    const dispatch = useDispatch();

    const favoritesList = useSelector((state) => state.favorite.favoritesList)

    let isAlreadyInFavoriteList = false;
    if (Array.isArray(favoritesList) &&  favoritesList.some((favorite) => favorite.productId === productId)) {
        isAlreadyInFavoriteList = true;
    }

    const handleHeartButtonOnClick = async () => {
        let newFavoritesList = [];
        if (!isAlreadyInFavoriteList) {
            newFavoritesList = await addFavoriteFromFavoriteList(productId);
        } else {
            newFavoritesList = await removeFavoriteFromFavoriteList(productId);
        }
        dispatch(setFavoriteList(newFavoritesList))
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