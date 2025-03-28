import axiosInstance from "./axiosInstance"
import { getGoogleOauth2Callback } from './constant';

export async function postGoogleOauth2Callback({state, code, isRegistered}) {
    try {
        const response = await axiosInstance.post(getGoogleOauth2Callback, {state, code}); 
        return response.data;
    } catch (error) {
        console.error("Error fetching google oauth2 callback fail: ", error);
        throw error;
    }
}