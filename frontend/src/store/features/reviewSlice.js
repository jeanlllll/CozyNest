import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    reviewPage: 0,
}

export const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setReviewPage: (state, action) => {
            state.reviewPage = action.payload;
        },
    }
})

export const {setReviewPage} = reviewSlice.actions;
export default reviewSlice.reducer;