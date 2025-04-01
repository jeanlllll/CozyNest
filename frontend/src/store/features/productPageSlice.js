import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    colorSelected: "",
    colorSelectedProductDisplayId: "",
    largeImageDisplay: "",
    sizeNProductVariantIdSelected: { size: "", productVariantId: "" },
    leftImageSelected: "",
    genderSelected: "",
    sizeAvailableListForF: [],
    sizeAvailableListForM: [],
    alert: {message: "", type: ""},
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
        setSizeNProductVariantIdSelected: (state, action) => {
            state.sizeNProductVariantIdSelected = action.payload;
        },
        resetSizeNProductVariantIdSelected: (state) => {
            state.sizeNProductVariantIdSelected = { size: "", productVariantId: "" }
        },
        setLeftImageSelected: (state, action) => {
            state.leftImageSelected = action.payload;
        },
        setGenderSelected: (state, action) => {
            state.genderSelected = action.payload;
        },
        setProductVariantIdSelected: (state, action) => {
            state.genderSelected = action.payload;
        },
        setAlert: (state, action) => {
            state.alert = action.payload;
        },
        resetProductPageGlobalState: (state) => {
            state.colorSelected = "",
                state.colorSelectedProductDisplayId = "",
                state.largeImageDisplay = "",
                state.sizeNProductVariantIdSelected = { size: "", productVariantId: "" },
                state.genderSelected = "",
                state.sizeAvailableListForF= [],
                state.sizeAvailableListForM= [],
                state.alert= {message: "", type: ""}
        }
    }
})

export const { setColorSelected, setColorSelectedProductDisplayId, setLargeImageDisplay, setSizeAvailableListForF, setSizeAvailableListForM,
    setSizeNProductVariantIdSelected, setLeftImageSelected, setGenderSelected, setAlert, resetProductPageGlobalState, resetSizeNProductVariantIdSelected } = productPageSlice.actions;
export default productPageSlice.reducer;