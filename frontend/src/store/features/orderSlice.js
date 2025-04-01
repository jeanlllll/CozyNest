import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    orderItemsList: [],
    discountCodeInfo: null

}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderItemsList: (state, action) => {
            state.orderItemsList = action.payload;
        },
        resetOrderItemsList: (state) => {
            state.orderItemsList = []
        },
        setDiscountCodeInfo: (state, action) => {
            state.discountCodeInfo = action.payload
        }
    }
})

export const { setOrderItemsList, resetOrderItemsList, setDiscountCodeInfo } = orderSlice.actions;
export default orderSlice.reducer;