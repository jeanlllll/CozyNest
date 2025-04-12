import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isLogin: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLogin: (state, action) => {
            state.isLogin = action.payload
        },
    }
})

export const { setIsLogin } = authSlice.actions;
export default authSlice.reducer;