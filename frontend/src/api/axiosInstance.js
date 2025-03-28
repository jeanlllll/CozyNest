import axios from "axios";
import { getcsrfTokenUrl } from "./constant";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_BACKEND_DOMAIN_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    xsrfCookieName: "CSRF_TOKEN", //csrf token carry in cookie
    xsrfHeaderName: "X-CSRF-TOKEN" //csrf token carry in header
})

axiosInstance.interceptors.request.use((config) => {
    const csrfToken = Cookies.get("CSRF_TOKEN");
    if (csrfToken) {
        config.headers["X-CSRF-TOKEN"] = csrfToken;
    }
    return config;
});

export default axiosInstance;