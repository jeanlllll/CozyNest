import { GoogleMailIcon } from "../assets/icons/GoogleMailIcon"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGoogleOauth2Url } from "../api/fetchGoogleOauth2Url";
import { usePageMeta } from "../components/usePageMeta";
import { postManualLogin } from "../api/postManualLogin";
import { useState } from "react";
import { postVerifyEmail } from "../api/postVerifyEmail";
import { fetchResendVerificationCode } from "../api/fetchResendVerificationCode";

export const LoginPage = () => {
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === 'en';
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    usePageMeta({ titleEn: "Login", titleZh: "登入", isEnglish: isEnglish });

    const handleGoogleLogin = async () => {
        try {
            const { oauth_url } = await fetchGoogleOauth2Url();
            window.location.href = oauth_url;

        } catch (error) {
            console.log("error")
        }
    }

    const handleForgotPassword = async () => {
        if (email === "") {
            alert("Please fill in email first to get the password")
        }
        const response = await fetchResendVerificationCode({email}); 
        if (response === 200) {
            alert(response.data);
        } 
        navigate("/user/verify-email")
    }

    const handleManualLogin = async () => {
        try {
            console.log(email, password)
            const response = await postManualLogin({email, password});
            if (response.status === 200) {
                alert("login successfully.")
                navigate("/")
            } else if (response.status === 403 && response.data === "Please verify email first") {
                alert(response.data)
                navigate("/user/verify-email")
            }
        } catch (error) {
            console.log("error")
        }
    }

    return (
        <>
            {/* desktop version */}
            <div className="container mx-auto lg:h-dvh flex lg:flex-row items-center justify-center font-inter">

                <div className="flex lg:border lg:border-gray-100 rounded-[2vh] overflow-hidden lg:shadow-xl lg:shadow-gray-200 my-8">

                    {/* Left Side (Image) */}
                    <div className="hidden lg:block lg:w-5/8">
                        <img src="/images/login_page_lg.png"
                            className="w-full h-full border-gray-300 shadow-xl shadow-gray-500"
                        />
                    </div>

                    {/* Right Side (Login Form) */}
                    <div className="lg:w-3/8 flex flex-col justify-start items-between w-100 px-7 lg:px-21 py-2 lg:py-0 ">

                        {/* Login */}
                        <button className="text-4xl font-protest font-bold flex justify-starttext-black lg:mt-14 mb-6">
                            {isEnglish ? "Login" : "登入"}
                        </button>

                        <button className="border border-gray-300 w-full h-14 flex items-center justify-center gap-4 font-inter font-semibold text-base text-gray-800 cursor-pointer
                            hover:bg-gray-100 transition hover:delay-100 duration-300" 
                            onClick={handleGoogleLogin}>
                            <GoogleMailIcon /> {isEnglish ? "Google Mail" : "Google 郵箱"}
                        </button>

                        <h2 className="flex items-center justify-center text-gray-400 font-inter py-4 font-lg">
                            OR
                        </h2>

                        {/* Email */}
                        <div className="mb-4">
                            <label for="email" className="text-lg font-semibold">{isEnglish ? "Email" : "電郵"}</label>
                            <input id="email" type="email"
                                placeholder="example@gamil.com"
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 h-14"
                            />
                        </div>

                        {/* Password */}
                        <div className="mt-2">
                            <label for="password" className="text-lg font-semibold">{isEnglish ? "Password" : "密碼"}</label>
                            <input id="password" name="email" type="password"
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 h-14"
                            />
                        </div>

                        <div className="flex items-center justify-end pr-1 text-gray-400 font-inter text-base cursor-pointer hover:underline"
                            onClick={() => handleForgotPassword()}
                        >
                            {isEnglish ? "Forget password?" : "忘記密碼？"}
                        </div>

                        <button className="drop-shadow-lg mt-12 bg-black rounded-lg w-full p-2 flex items-center justify-center font-bold text-lg text-white cursor-pointer font-inter
                            hover:bg-gray-800"
                            onClick={() => handleManualLogin()}>
                            {isEnglish ? "Submit" : "提交"}
                        </button>

                        <button className="mb-5 md:mb-10 mt-3 pl-2 flex items-center justify-start pr-1 text-gray-400 font-inter text-base cursor-pointer 
                            hover:underline" onClick={() => navigate("/user/register")}>
                            {isEnglish ? "Do not have account yet?" : "沒有帳號？"}
                        </button>

                    </div>

                </div>
            </div >

        </>
    )



}
