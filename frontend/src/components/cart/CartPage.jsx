import { useLoaderData, useNavigate } from "react-router"
import { StatusBar } from "./StatusBar"
import { useDispatch } from "react-redux";
import { CartItemsSection } from "./CartItemsSection";
import { PriceSummary } from "./PriceSummary";

export const CartPage = ({isEnglish}) => {
    const data = useLoaderData();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className=" px-7 sm:px-0 w-full flex flex-col items-center justify-center mb-10 sm:mb-20">
            <div className="container flex-1">
                <h1 className="font-bold text-2xl sm:text-3xl mt-8 sm:mt-13">{isEnglish ? "Shopping Cart" : "購物車"}</h1>
                <div className="mt-8 sm:mt-12">
                    <StatusBar status={"cart"} isEnglish={isEnglish}/>
                </div>

                {data.length > 0 && (
                    <div>
                        <div className="mt-10 sm:mt-15">
                            <CartItemsSection data={data}/>
                        </div>

                        <div className="border border-gray-300 flex flex-col w-full mt-6 h-auto rounded-lg sm:rounded-xl text-base sm:text-xl px-4 sm:px-28 py-6 sm:py-12 sm:mt-20">
                            <PriceSummary needButton={true} needAdjustDiscountButton={false} isEnglish={isEnglish} needTransportationFee={false}/>
                        </div>
                    </div>
                )}

                {data.length === 0 && (
                    <div className="flex-grow mt-16 sm:mt-30">
                        <div className="text-gray-600 flex flex-col justify-center text-center">
                            <h1 className="font-bold text-base sm:text-lg">{isEnglish ? "No items in Shopping Cart Yet" : "購物車內尚無商品"}</h1>
                            <div>
                                <button 
                                    className="mt-4 px-4 sm:px-6 py-2 text-base sm:text-lg bg-buttonMain text-white rounded-md cursor-pointer hover:bg-opacity-90"
                                    onClick={() => navigate("/")}
                                >
                                    Return To Home Page
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

