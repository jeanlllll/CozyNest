import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    chatHistory: [{role: 'assistant', content: "Hello and welcome to CozyNest! 😊 How can I assist you today? Whether it's about our products, sizing, orders, or returns, I'm here to help!" }]
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatHistory: (state, action) => {
            state.chatHistory = action.payload;
        },
        clearChat: (state) => {
            chatHistory: [{role: 'assistant', content: "Hello and welcome to CozyNest! 😊 How can I assist you today? Whether it's about our products, sizing, orders, or returns, I'm here to help!" }]
        }
    }
})

export const { setChatHistory, clearChat } = chatSlice.actions;
export default chatSlice.reducer;