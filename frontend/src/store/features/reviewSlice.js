import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    rating: 0,
    reviewPage: 0,
}

export const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setRating: (state, action) => {
            state.rating = action.payload;
        },
        setReviewPage: (state, action) => {
            state.reviewPage = action.payload;
        },
    }
})

export const {setRating, setReviewPage} = reviewSlice.actions;
export default reviewSlice.reducer;