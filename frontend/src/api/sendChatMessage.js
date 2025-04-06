import { sendChatMessageUrl } from "./constant";
import axiosInstance from "./axiosInstance";
import { getSessionId } from "../Helper/getSessionId";

export const sendChatMessage = async (newMessage) => {
    try {
        const response = await axiosInstance.post(sendChatMessageUrl, {
            message: newMessage,
            sessionId: getSessionId()
        });
        return response;
    } catch (error) {
        return error.response;
    }
}