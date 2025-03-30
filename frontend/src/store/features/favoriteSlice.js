import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    favoritesList: [],
    favoritePage: 0,
}

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setFavoriteList: (state, action) => {
            state.favoritesList = action.payload
        },
        resetFavoriteList: (state) => {
            state.favoritesList = [];
        },
        setFavoritePage: (state, action) => {
            state.favoritePage = action.payload
        },
        resetFavoritePage: (state) => {
            state.favoritePage = 0;
        },
    }
})

export const { setFavoriteList, resetFavoriteList, setFavoritePage, resetFavoritePage } = favoriteSlice.actions;
export default favoriteSlice.reducer;