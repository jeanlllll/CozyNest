import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    language: 'zh-hk'
}

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        switchToTraditionalChinese: (state) => {
            state.language = 'zh-hk';
        },
        switchToEnglish: (state) => {
            state.language = 'en';
        }
    }
})

export const {switchToTraditionalChinese, switchToEnglish} = languageSlice.actions;
export default languageSlice.reducer;