import axiosInstance from "./axiosInstance"
import { getGoogleOauth2Url } from './constant';

export async function fetchGoogleOauth2Url() {
    try {
        const response = await axiosInstance.get(getGoogleOauth2Url); // Required for CSRF-protected requests
        return response.data;
    } catch (error) {
        console.error("Error getting google oauth2 link and state from backend: ", error);
        throw error;
    }
}