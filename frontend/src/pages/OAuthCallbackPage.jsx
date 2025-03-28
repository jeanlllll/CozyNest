import { useNavigate } from "react-router";
import { postGoogleOauth2Callback } from "../api/postGoogleOauth2Callback";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const Oauth2CallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        const handleOauth2Callback = async() => {
            try {
                const response = await postGoogleOauth2Callback({state, code});
                if (response?.message === "Google oauth2 register success.") {
                    alert("register successfully.")
                }
                navigate("/");
            } catch (err) {
                alter("Oauth login failed", err);
                navigate("/user/login");
            }
        }

        handleOauth2Callback();
    }, []);

    return <div>Processsing Google Login</div>
}