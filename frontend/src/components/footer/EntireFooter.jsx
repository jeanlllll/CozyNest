import { useNavigate } from "react-router"
import { InstagramIcon } from "../../assets/icons/InstagramIcon"
import { FacebookIcon } from "../../assets/icons/FaceBookIcon"
import { WhatsappIcon } from "../../assets/icons/WhatsappIcon"
import { Subscription } from "./Subscription"
import { RightReservedFooter } from "./RightReservedFooter"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"

export const EntireFooter = () => {
    const navigate = useNavigate();

    const language = useSelector((state) => state.language.language);
    const [isEnglish, setIsEnglish] = useState(true);

    useEffect(() => {
        setIsEnglish(language === 'en');
    }, [language]);

    return (
        <div className="bg-secondPrimary w-full drop-shadow-lg">

            {/* Desktop Version */}

            <div className="hidden sm:flex container mx-auto justify-between  mt-7 mb-7">
                {/* About Us */}
                <div className="w-1/4 flex flex-col item-left lg:items-center text-left mt-7 mb-8">
                    <ul className="space-y-3 font-thin">
                        <li>
                            <h3 className="text-gray-900 mb-2 font-bold">{isEnglish ? "About Us" : "關於我們"}</h3>
                        </li>
                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/our-story")}>
                                {isEnglish ? "Our Story" : "我們的故事"}
                            </span>
                        </li>

                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/contact")}>
                                {isEnglish ? "Contact" : "聯繫我們"}
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div className="w-1/4 flex flex-col lg:items-center text-left mt-7 mb-6">
                    <ul className="space-y-3 font-thin">
                        <li>
                            <h3 className="text-gray-900 mb-2 font-bold">{isEnglish ? "Customer Service" : "客戶服務"}</h3>
                        </li>
                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/faqs")}>
                                {isEnglish ? "FAQs" : "常見問題"}
                            </span>
                        </li>

                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/shipping-returns")}>
                                {isEnglish ? "Shipping & Returns" : "運輸與退貨"}
                            </span>
                        </li>

                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/size-guide")}>
                                {isEnglish ? "Size Guide" : "尺寸指南"}
                            </span>
                        </li>
                    </ul>

                </div>

                {/* find us */}
                <div className="w-1/4 flex flex-col lg:items-center text-left mt-7 mb-8">

                    <div className="flex flex-col">
                        <h3 className="font-bold mb-2">{isEnglish ? "Find Us" : "關注我們"}</h3>
                        <div className="flex flex-row space-x-2">
                            <div className="cursor-pointer" onClick={() => window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")}>
                                <InstagramIcon />
                            </div>

                            <div className="cursor-pointer" onClick={() => window.open("https://www.facebook.com/", "_blank", "noopener,noreferrer")}>
                                <FacebookIcon />
                            </div>

                            <div className="cursor-pointer" onClick={() => window.open("https://www.whatsapp.com/", "_blank", "noopener,noreferrer")}>
                                <WhatsappIcon />
                            </div>

                        </div>
                    </div>
                </div>

                {/* NewsLetter */}
                <div className="w-full sm:w-1/4 flex flex-col md:items-center text-left mt-0 sm:mt-7 mb-8">
                    <div>
                        <h3 className="font-bold mb-2">{isEnglish ? "Newsletter" : "接收最新消息"}</h3>
                        <Subscription />
                    </div>
                </div>

            </div>

            {/* ---------------------------------------------------------------------------------------------  */}

            {/* Mobile Version */}
            <div className="sm:hidden flex container mx-auto justify-between max-w-[90%] mt-7 mb-7 text-sm">
                {/* About Us */}
                <div className="w-1/3 flex flex-col item-left text-left mt-7">
                    <ul className="space-y-3 font-thin">
                        <li>
                            <h3 className="text-gray-900 mb-2 font-bold">{isEnglish ? "About Us" : "關於我們"}</h3>
                        </li>
                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/our-story")}>
                                {isEnglish ? "Our Story" : "我們的故事"}
                            </span>
                        </li>

                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/contact")}>
                                {isEnglish ? "Contact" : "聯繫我們"}
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div className="w-1/3 flex flex-col text-left mt-7 mb-2">
                    <ul className="space-y-3 font-thin">
                        <li>
                            <h3 className="text-gray-900 mb-2 font-bold">{isEnglish ? "Customer Service" : "客戶服務"}</h3>
                        </li>
                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/faqs")}>
                                {isEnglish ? "FAQs" : "常見問題"}
                            </span>
                        </li>

                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/shipping-returns")}>
                                {isEnglish ? "Shipping & Returns" : "運輸與退貨"}
                            </span>
                        </li>

                        <li>
                            <span className="cursor-pointer" onClick={() => navigate("/size-guide")}>
                                {isEnglish ? "Size Guide" : "尺寸指南"}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="w-1/3 flex flex-col ml-9 text-left mt-7">
                    <h3 className="font-bold mb-2">{isEnglish ? "Find Us" : "關注我們"}</h3>
                    <div className="flex flex-row space-x-1">
                        <InstagramIcon />
                        <FacebookIcon />
                        <WhatsappIcon />
                    </div>
                </div>
            </div>

            {/* find us */}


            <div className="sm:hidden flex container mx-auto justify-between max-w-[90%] mt-7 mb-7 text-sm">
                {/* NewsLetter */}
                <div className="w-full sm:w-1/4 flex flex-col text-left mt-0 sm:mt-7 mb-2">
                    <div>
                        <h3 className="font-bold mb-2">{isEnglish ? "Newsletter" : "接收最新消息"}</h3>
                        <Subscription />
                    </div>
                </div>
            </div>

            <RightReservedFooter />


        </div>
    )
}