import { useEffect, useState } from "react";
import { GoogleMailIcon } from "../assets/icons/GoogleMailIcon"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

export const RegisterPage = () => {
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === 'en';
    const navigate = useNavigate();

    return (
        <>
            {/* desktop version */}
            <div className="container mx-auto lg:h-dvh flex lg:flex-row items-center justify-center font-inter">

                <div className="flex lg:border lg:border-gray-200 rounded-[2vh] overflow-hidden lg:shadow-xl lg:shadow-gray-200 my-8">

                    {/* Left Side (images) */}
                    <div className="lg:w-3/8 flex flex-col justify-start items-between w-100 px-7 lg:px-21 py-2 lg:py-0 ">

                        {/* Login */}
                        <h2 className="text-4xl font-protest font-bold text-black lg:mt-7 mb-5">
                            {isEnglish ? "Register" : "注冊"}
                        </h2>

                        <button className="border border-gray-300 w-full h-14 flex items-center justify-center gap-4 font-inter font-semibold text-base text-gray-800 cursor-pointer
                            hover:bg-gray-100 transition hover:delay-150 duration-300">
                            <GoogleMailIcon /> {isEnglish ? "Google Mail" : "Google 郵箱"}
                        </button>

                        <h2 className="flex items-center justify-center text-gray-400 font-inter pt-2 font-lg">
                            OR
                        </h2>

                        {/* Name */}
                        <div className="mb-2 flex flex-row gap-3">
                            <div className="w-4/7">
                                <label for="firstName" className="text-lg font-semibold">{isEnglish ? "First Name" : "名字"}</label>
                                <input id="firstName" type="text"
                                    placeholder="Peter"
                                    className="w-full px-3 py-2 mt-0.5 border border-gray-300 h-14"
                                />
                            </div>
                            <div className="w-3/7">
                                <label for="lastName" className="text-lg font-semibold">{isEnglish ? "Last Name" : "姓氏"}</label>
                                <input id="lastName" type="text"
                                    placeholder="  Chan"
                                    className="w-full py-2 mt-0.5 border border-gray-300 h-14"
                                />
                            </div>
                        </div>


                        {/* Email */}
                        <div className="mb-2">
                            <label for="email" className="text-lg font-semibold">{isEnglish ? "Email" : "電郵"}</label>
                            <input id="email" type="email"
                                placeholder="example@gamil.com"
                                className="w-full px-3 py-2 mt-0.5 border border-gray-300 h-14"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-2">
                            <label for="password" className="text-lg font-semibold">{isEnglish ? "Password" : "密碼"}</label>
                            <input id="password" name="email" type="password"
                                placeholder="password"
                                className="w-full px-3 py-2 mt-0.5 border border-gray-300 h-14"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-2">
                            <label for="confirmPassword" className="text-lg font-semibold">{isEnglish ? "Confirm Password" : "確認密碼"}</label>
                            <input id="confirmPassword" name="email" type="password"
                                placeholder="password"
                                className="w-full px-3 py-2 mt-0.5 border border-gray-300 h-14"
                            />
                        </div>

                        {/* subscribe checkbox*/}
                        <div className="flex flex-col text-gray-400 font-inter text-sm mt-1">
                            <label for="newsletter" className="flex items-start gap-2 cursor-pointer">

                                <input
                                    id="newsletter"
                                    type="checkbox"
                                    name="newsletter"
                                    className="mt-1 accent-purple-500" defaultChecked
                                />

                                <div className="text-gray-400">
                                    {isEnglish? "Subscribe to our newsletter and receive the latest news, updates, and exclusive offers." :
                                    "訂閱我們的電子報，隨時掌握最新消息、更新和獨家優惠。"}
                                </div>
                            </label>
                        </div>


                        <button className="drop-shadow-lg mt-8 bg-black rounded-lg w-full p-2 flex items-center justify-center font-bold text-lg text-white cursor-pointer font-inter
                            hover:bg-gray-800">
                            {isEnglish ? "Submit" : "提交"}
                        </button>

                        <button className="mb-5 md:mb-10 mt-1 pl-2 flex items-center justify-start pr-1 text-gray-400 font-inter text-base cursor-pointer 
                            hover:underline" onClick={() => navigate("/user/login")}>
                            {isEnglish ? "Already have account?" : "已經有帳號？"}
                        </button>
                    </div>


                    {/* Right Side (login) */}
                    <div className="hidden lg:block lg:w-5/8">
                        <img src="/images/register_image_lg.png"
                            className="w-full h-full border-gray-300 shadow-xl shadow-gray-500"
                        />
                    </div>

                </div>
            </div >

        </>
    )



}
