import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const HeroSection = () => {
    const language = useSelector((state) => state.language.language);
    const [isEnglish, setIsEnglish] = useState(true);

    useEffect(() => {
        setIsEnglish(language === 'en');
    }, [language]);

    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const updateImage = () => {
            const width = window.innerWidth;
            if (width > 1024) {
                setImageSrc("/images/hero_image_lg.png")
            } else if (width >=768 && width <=1024) {
                setImageSrc("/images/hero_image_md.png")
            } else {
                setImageSrc("/images/hero_image_sm.png")
            }
        };
        updateImage();
        window.addEventListener("resize", updateImage);
        return () => {
            window.removeEventListener("resize", updateImage); //when pag is unmounted, remove this event listener to window
        }
    })

    return (
        <>
            <div className="relative w-full ">

                <div className="relative w-full">
                    {/* images */}
                    <img
                        src={imageSrc}
                        className="w-full h-auto lg:h-[799px]"
                    />

                    {/* solgan */}
                    {/* desktop version*/}
                    <div className="absolute top-[70%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center sm:p-6 font-inter text-gray-800 sm:text-white">
                        <h1 className="font-protest drop-shadow-2xl text-3xl sm:text-6xl font-bold">{isEnglish ? "Dream in Comfort" : "舒適好夢"}</h1>
                        <p className="font-protest drop-shadow-black sm:drop-shadow-lg mt-1 text-lg/5 sm:text-2xl w-80 sm:w-170">
                            {isEnglish ? "Cozy, stylish pajamas for men, women, and couples—because restful nights start with the perfect fit." :
                                "精選時尚又舒適的睡衣，專為男士、女士與情侶打造，讓您輕鬆享受美好睡眠。"}
                        </p>
                        <button className="mt-2 sm:mt-4 px-6 sm:px-10 py-3 sm:py-5.5 bg-thirdPrimary font-protest text-white rounded-[36px] text-xl sm:text-4xl font-semibold shadow-md shadow-thirdPrimary/50 
                        transition delay-150 duration-300 ease-in-out cursor-pointer hover:scale-105 hover:drop-shadow-2xl sm:hover:opacity-90">
                            <p className="drop-shadow-xl">{isEnglish ? "Shop Pajamas Now" : "選購睡衣"}</p>
                        </button>
                    </div>


                </div>
            </div>


        </>
    )
}

