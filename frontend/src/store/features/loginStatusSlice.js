import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    isLoggedIn: false 
}

export const loginStatusSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setIsLoggedInToTrue: (state) => {
            state.isLoggedIn = true;
        },
        setIsLoggedInToFalse: (state) => {
            state.isLoggedIn = false;
        },
    }
})

export const {setIsLoggedInToTrue, setIsLoggedInToFalse} = loginStatusSlice.actions;
export default loginStatusSlice.reducer;