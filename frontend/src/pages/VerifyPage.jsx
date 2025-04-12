import { useState } from "react";
import { postVerifyEmail } from "../api/postVerifyEmail";
import { useNavigate } from "react-router";
import { fetchResendVerificationCode } from "../api/fetchResendVerificationCode";

export const VerifyPage = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [email, setEmail] = useState(location.state?.email || "");
    const navigate = useNavigate();

    const handleVerifyEmail = async () => {
        try {
            if (!email || !verificationCode) {
                alert("Please fill in both email and verification code");
                return;
            }
            
            const response = await postVerifyEmail({email,verificationCode});
            
            if (response.status === 200) {
                alert("Verify successfully.");
                navigate("/");
            } else if (response.status === 400) {
                alert(response.data)
                setVerificationCode("");
            } else if (response.status === 410) {
                alert(response.data)
                setVerificationCode("");
            }
        } catch (error) {
            console.error("Verification error:", error);
            alert(error.response?.data || "Verification failed. Please try again.");
        }
    }

    const handleResendCode = async () => {
        if (email === "") {
            alert("Please fill in email for verfication code resend.")
        } 
        const response = await fetchResendVerificationCode({email});
        if (response.status === 200) {
            alert(response.data);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center px-4 font-inter">
            <div className="w-full sm:max-w-4xl bg-white p-6 sm:p-10 rounded-lg drop-shadow-lg border-gray-300">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-buttonMain">
                    Email Verification
                </h1>

                <div className="space-y-4 sm:space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm sm:text-lg font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            id="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Verification Code Input */}
                    <div>
                        <label htmlFor="verificationCode" className="block text-sm sm:text-lg font-medium text-gray-700 mb-2">
                            Verification Code
                        </label>
                        <input 
                            type="text" 
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.trim())}
                            className="w-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter verification code"
                        />
                    </div>

                    <div className="flex justify-end">
                        <span 
                            onClick={() => handleResendCode()}
                            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 cursor-pointer hover:underline transition-colors duration-200"
                        >
                            Request to resend code
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button 
                        onClick={handleVerifyEmail}
                        className="w-full bg-buttonMain text-white py-2 sm:py-3 text-base sm:text-xl rounded-md hover:bg-gray-800 transition duration-300 mt-4 cursor-pointer"
                    >
                        Verify Email
                    </button>
                </div>
            </div>
        </div>
    );
}