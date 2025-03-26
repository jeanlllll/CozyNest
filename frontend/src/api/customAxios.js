import axiosInstance from "./axiosInstance"
import { getcsrfTokenUrl } from constant

export const ensureCsrfToken = async ()  => {
    if (!document.cookie.includes("CSRF-TOKEN")) {
        await axiosInstance.get(getcsrfTokenUrl, {
            withCredentials: true //allow carry cookie
        })
    }
}
