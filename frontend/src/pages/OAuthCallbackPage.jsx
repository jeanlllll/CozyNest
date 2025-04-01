import { useNavigate } from "react-router";
import { postGoogleOauth2Callback } from "../api/postGoogleOauth2Callback";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import { setIsLoggedInToTrue } from "../store/features/loginStatusSlice";
import { useDispatch } from "react-redux";

export const Oauth2CallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        
        const handleOauth2Callback = async() => {
            try {
                const response = await postGoogleOauth2Callback({state, code});
                if (response.status === 200) {
                    alert("Login Successfully");
                    dispatch(setIsLoggedInToTrue());
                }
                navigate("/");
            } catch (err) {
                alert("Oauth login failed", err);
                navigate("/user/login");
            }
        }

        handleOauth2Callback();
    }, []);

    return <div>Processsing Google Login</div>
}