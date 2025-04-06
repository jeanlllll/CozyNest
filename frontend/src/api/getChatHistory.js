import { getSessionId } from "../Helper/getSessionId";
import axiosInstance from "./axiosInstance";
import { getChatHistoryUrl } from "./constant";

export const getChatHistory = async () => {
    try {
        const sessionId = getSessionId();
        const response = await axiosInstance.get(getChatHistoryUrl(sessionId));
        return response;
    } catch (error) {
        return error.response;
    }
}


