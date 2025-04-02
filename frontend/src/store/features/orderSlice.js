import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    orderItemsList: [],
    totalOriginalAmount: 0,
    promotionAmount: 0,
    discountCodeInfo: {},
    discountAmount: 0,
    transportationMethod: "STANDARD",
    shippingInfo: null
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
        },
        setTotalOriginalAmount: (state, action) => {
            state.totalOriginalAmount = action.payload;
        },
        setPromotionAmount: (state, action) => {
            state.promotionAmount = action.payload;
        },
        setDiscountAmount: (state, action) => {
            state.discountAmount = action.payload;
        },
        setTransportationMethod: (state, action) => {
            state.transportationMethod = action.payload;
        },
        setShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
        },
        resetOrderPriceNDiscount: (state) => {
            state.originalAmount = 0,
            state.promotionAmount = 0,
            state.discountCodeInfo = null,
            state.discountAmount = 0
        },
        resetOrderDetail: (state) => {
            state.orderItemsList = [],
                state.originalAmount = 0,
                state.promotionAmount = 0,
                state.discountCodeInfo = {},
                state.discountAmount = 0,
                state.transportationMethod = "STANDARD",
                state.shippingInfo = null;
        }
    }
})

export const { setOrderItemsList, resetOrderItemsList, setDiscountCodeInfo, setTotalOriginalAmount, setPromotionAmount, setDiscountAmount, setTransportationMethod, setShippingInfo, resetOrderDetail, resetOrderPriceNDiscount } = orderSlice.actions;
export default orderSlice.reducer;