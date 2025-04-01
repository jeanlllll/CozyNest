import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    cartItemsList: [],
    showAlertCartItemIdList: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItemsList: (state, action) => {
            state.cartItemsList = [...action.payload]
        },
        resetCartItemsList: (state) => {
            state.cartItemsList = []
        },
        setShowAlertCartItemIdList: (state, action) => {
            state.showAlertCartItemIdList = [...action.payload]
        },
        resetAll: (state) => {
            state.cartItemsList= [],
            state.showAlertCartItemIdList= []
        }
    }
})

export const { setCartItemsList, resetCartItemsList, setShowAlertCartItemIdList } = cartSlice.actions;
export default cartSlice.reducer;