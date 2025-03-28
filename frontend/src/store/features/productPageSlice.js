import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    colorSelected: "",
    colorSelectedProductDisplayId: "",
    largeImageDisplay: "",
    sizeSelected: "",
    leftImageSelected: "",
    genderSelected: "",
    sizeAvailableListForF: [],
    sizeAvailableListForM: []
}

export const productPageSlice = createSlice({
    name: 'productPageGlobalState',
    initialState: initialState,
    reducers: {
        setColorSelected: (state, action) => {
            state.colorSelected = action.payload;
        },
        setColorSelectedProductDisplayId: (state, action) => {
            state.colorSelectedProductDisplayId = action.payload;
        },
        setLargeImageDisplay: (state, action) => {
            state.largeImageDisplay = action.payload;
        },
        setSizeAvailableListForF: (state, action) => {
            state.sizeAvailableListForF = action.payload;
        },
        setSizeAvailableListForM: (state, action) => {
            state.sizeAvailableListForM = action.payload;
        },
        setSizeSelected: (state, action) => {
            state.sizeSelected = action.payload;
        },
        setLeftImageSelected: (state, action) => {
            state.leftImageSelected = action.payload;
        },
        setGenderSelected: (state, action) => {
            state.genderSelected = action.payload;
        },
        resetProductPageGlobalState: (state) => {
            state.colorSelected = "",
                state.colorSelectedProductDisplayId = "",
                state.largeImageDisplay = "",
                state.sizeAvailableMap = new Map(),
                state.sizeSelected = "",
                state.genderSelected = "",
                state.sizeAvailableListForF= [],
                state.sizeAvailableListForM= []
        }
    }
})

export const { setColorSelected, setColorSelectedProductDisplayId, setLargeImageDisplay, setSizeAvailableListForF, setSizeAvailableListForM,
    setSizeSelected, setLeftImageSelected, setGenderSelected, resetProductPageGlobalState } = productPageSlice.actions;
export default productPageSlice.reducer;