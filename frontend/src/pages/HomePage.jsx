import { useLoaderData } from "react-router-dom"
import { HeroSection } from "../components/home/HeroSection";
import { EntireHeader } from "../components/header/EntireHeader";
import { EntireFooter } from "../components/footer/EntireFooter";
import { TrendingProductsSection } from "../components/home/TrendingProductsSection"
import { useSelector } from "react-redux";
import { categoryChinese } from "../api/constant";

export const HomePage = () => {

    const trendingProducts = useLoaderData();

    const language = useSelector((state) => state.language.language);

    const getProductsByCategory = (category) => trendingProducts[category] || [];

    return (
        <div className="lg:h-screen">
            <div className="lg:h-screen lg:overflow-y-scroll scroll-smooth lg:snap-y lg:snap-mandatory">

                <section className="lg:h-dvh flex flex-col lg:snap-start">
                    {/* Header */}
                    <div className="relative z-20">
                        <EntireHeader />
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
        </div>

    )
}