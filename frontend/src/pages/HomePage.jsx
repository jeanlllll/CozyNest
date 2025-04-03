import { useLoaderData } from "react-router-dom"
import { HeroSection } from "../components/home/HeroSection";
import { EntireHeader } from "../components/header/EntireHeader";
import { EntireFooter } from "../components/footer/EntireFooter";
import { TrendingProductsSection } from "../components/home/TrendingProductsSection"
import { useSelector } from "react-redux";
import { categoryChinese } from "../assets/data/data";
import { useEffect, useRef } from "react";
import { AIAgentButton } from "../components/sideButtons/AiAgentButton";
import { ContainerScrollToTopButton } from "../components/sideButtons/ContainerScrollToTopButton";
import { WindowScrollToTopButton } from "../components/sideButtons/WindowScrollToTopButton";

export const HomePage = () => {
    const scrollRef = useRef(null);

    const trendingProducts = useLoaderData();

    const language = useSelector((state) => state.language.language);
    const isEnglish = language === 'en';

    const getProductsByCategory = (category) => trendingProducts[category] || [];

    useEffect(() => {
        document.title = isEnglish ? "CozyNest | Home" : "CozyNest | 首頁";

        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
            favicon.href = "/images/cozyNestLogo.png";
          }
    }, [isEnglish])

    return (
        <div className="sm:scroll-container lg:h-screen">
            <div className="lg:h-screen lg:overflow-y-scroll scroll-smooth lg:snap-y lg:snap-mandatory" ref={scrollRef}>

                <section className="lg:h-dvh flex flex-col lg:snap-start">
                    {/* Header */}
                    <div className="relative z-20">
                        <EntireHeader needSearchBar={true} needCategory={true} needPromotionBar={true}/>
                    </div>

                    {/* Hero Section */}
                    <div className="relative z-10">
                        <HeroSection />
                    </div>

                </section>

                {/* Trending Product By Categoires Section */}

                <section className="lg:h-dvh flex items-center justify-center lg:snap-start">
                    <div className="container mx-auto">
                        <p className="lg:hidden font-protest text-3xl mt-15 italic text-center mb-6">
                            {language === 'en' ? "Top 8 Trending Products by Categories" : "各分類前八的熱銷商品"}
                        </p>
                        <TrendingProductsSection category={"Women"} products={getProductsByCategory("WOMEN")} language={language} categoryChinese={categoryChinese["WOMEN"]} />
                    </div>
                </section>

                <section className="lg:h-dvh flex items-center justify-center lg:snap-start">
                    <div className="container mx-auto">
                        <TrendingProductsSection category={"Men"} products={getProductsByCategory("MEN")} language={language} categoryChinese={categoryChinese["MEN"]} />
                    </div>
                </section>


                <section className="lg:h-auto items-center lg:snap-start lg:flex lg:flex-col">
                    <div className="flex items-center justify-center">
                        <div className="container mx-auto">
                            <TrendingProductsSection category={"Couple"} products={getProductsByCategory("COUPLE")} language={language} categoryChinese={categoryChinese["COUPLE"]} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 lg:w-full">
                        <EntireFooter />
                    </div>

                </section>
            </div >

            <div className="z-50">
                <div className="hidden lg:block"><ContainerScrollToTopButton scrollRef={scrollRef} /></div>
                <div className="md:hideen"><WindowScrollToTopButton /></div>
                <div className="relative z-30">
                    <AIAgentButton />
                </div>
            </div>
        </div>

    )
}