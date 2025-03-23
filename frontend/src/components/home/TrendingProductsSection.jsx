import { useEffect, useRef } from "react";
import { ArrowRight } from "../../assets/icons/ArrowRight";
import { ArrowLeft } from "../../assets/icons/ArrowLeft";
import { useState } from "react";

export const TrendingProductsSection = ({ category, products, language, categoryChinese }) => {

    const scrollContainerRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const checkScroll = () => {
            if (!container) return;
            setAtStart(container.scrollLeft === 0);
            setAtEnd(Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth);
        };

        checkScroll();

        container.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        return () => {
            container.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        }
    }, [products])

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 250, behavior: "smooth" });
        }
    }

    const handleScrolLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -250, behavior: "smooth" });
        }
    }

    return (
        <div>
            {/*--------desktop version--------*/}
            <div className="px-6 relative hidden lg:block">

                <div className="flex justify-between">
                    {/* Section Title*/}
                    <h1 className="font-protest text-4xl mt-6 ">{language === 'en' ? `Top 8 Trending Products By Categories - ${category}` :
                        `前八熱銷商品 - ${categoryChinese}`}</h1>

                    {/* click to see more */}
                    <div className="font-inter bg-black rounded-lg border px-6 py-3 text-bold text-white cursor-pointer hover:scale-105 hover:bg-gray-900 drop-shadow-lg mt-4">
                        <p className="drop=shadow-lg">{language === 'en' ? "View More" : "了解更多"}</p>
                    </div>

                </div>

                {/* Trending Items Grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-15 gap-y-3">
                    {products.map((product) => {

                        //get primary image
                        const productImage = product.productDisplayDtoList.find((img) => img.isPrimary)?.url ||
                            product?.productDisplayDtoList?.[0]?.url; //if found more than 1 isPrimary Key product, get the first one

                        //get product name
                        const productName = product.productTranslattionDtoList.find((item) => item.languageCode === language)?.productName || "Unnamed Product";

                        return (
                            <div key={product.productId} className="drop-shadow-md rounded-lg">

                                {/* product Image */}
                                <img src={productImage} alt={productName} className="w-full h-auto rounded-lg hover:scale-105 mb-2 cursor-pointer" />


                                {/* product Info */}
                                <div className="">
                                    <p className="text-lg font-semibold">{productName}</p>
                                    <p className="text-gray-500">HKD {product.productPrice}</p>
                                </div>

                            </div>

                        )
                    })}
                </div>
            </div>

            {/*--------mobile version--------*/}
            <div className="lg:hidden px-6 pt-3 mb-6 relative">

                <div className="flex flex-row justify-between items-start">
                    <h1 className="lg:hidden font-protest text-3xl pl-4">{language === 'en' ? category : categoryChinese}</h1>

                    <div className="font-inter bg-black rounded-lg border px-3 py-2 text-bold text-white cursor-pointer hover:scale-105 hover:bg-gray-900 drop-shadow-lg">
                        <p className="drop=shadow-lg">{language === 'en' ? "View More" : "了解更多"}</p>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth no-scrollbar w-full"
                >

                    {products.map((product, index) => {

                        //get primary image
                        const productImage = product.productDisplayDtoList.find((img) => img.isPrimary)?.url ||
                            product?.productDisplayDtoList?.[0]?.url; //if found more than 1 isPrimary Key product, get the first one

                        //get product name
                        const productName = product.productTranslattionDtoList.find((item) => item.languageCode === language)?.productName || "Unnamed Product";

                        return (
                            <>
                                <div key={index} className="snap-x w-full h-full">
                                    <div className="text-black text-center ">

                                        {/* product Image */}
                                        <div className="relative">

                                            <div className="snap-center w-80 h-80 px-2 pt-3 ">
                                                <img src={productImage} alt={productName}
                                                    className="rounded-lg hover:scale-105 cursor-pointer border border-gray-200 drop-shadow-lg" />
                                            </div>


                                            <div className="text-center font-inter">
                                                <p className="text-lg font-bold">{productName}</p>
                                                <p className="text-gray-500">HKD {product.productPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )

                    })}

                    {!atStart && (<div
                        className="absolute top-[50%] left-3 transform -translate-y-1/2  p-7 rounded-full cursor-pointer"
                        onClick={handleScrolLeft}
                    >
                        <ArrowLeft />
                    </div>)}

                    {!atEnd && (<div className="absolute top-[50%] right-3 transform -translate-y-1/2 bg-transparent p-7 rounded-full cursor-pointer"
                        onClick={handleScrollRight}
                    >
                        <ArrowRight />
                    </div>)}

                </div>
            </div>

        </div>
    )
}