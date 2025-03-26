import axios from "axios";
import { store } from "../store/store"

const apiUrl = import.meta.env.VITE_BACKEND_DOMAIN_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    xsrfCookieName: "CSRF_TOKEN", //csrf token carry in cookie
    xsrfHeaderName: "X-CSRF-TOKEN" //csrf token carry in header
})

// inject language header form global state
axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const language = state.language.language;

    config.headers["Accept-Language"] = language;

    return config;
});

export default axiosInstance;