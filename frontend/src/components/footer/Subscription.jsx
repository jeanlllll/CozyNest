import { postSubscription } from "../../api/postSubscription"
import { useState } from "react";

export const Subscription = ({isEnglish}) => {
    const [email, setEmail] = useState("");

    const handleSubscribe = async () => {

        if (!email) {
            alert("Please enter your email first.");
            return;
        }

        if (!email.includes("@")) {
            alert("Invalid email format.");
            return;
        }

        try {
            const response = await postSubscription(email);
            if (response.status === 200) {
                alert("Subscribe successfully.")
                setEmail("");
            } else if (response.status === 409) {
                alert("Email already subscribed.")
                setEmail("");
            }
        } catch (error) {
            alert("Subscribe failed, pelase try again later.")
        }
        
    }

    return (
        <div className="relative w-56 sm:w-64 font-inter">
            {/* Email Input */}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-3 py-[6px] pr-21 sm:pr-24 rounded-lg bg-white border border-gray-400 focus:outline-none focus:border-gray-400"
            />

            {/* Submit Button */}
            <button className="absolute py-[6.9px] px-4  top-0.4 right-[1px] bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => handleSubscribe()}
            >{isEnglish? "Submit" : "提交"}</button>

        </div >
        
    )
}