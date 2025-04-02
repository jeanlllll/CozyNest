import { useLoaderData } from "react-router"
import { StatusBar } from "./StatusBar"
import { useDispatch } from "react-redux";
import { CartItemsSection } from "./CartItemsSection";
import { PriceSummary } from "./PriceSummary";

export const CartPage = () => {
    
    const data = useLoaderData();
    const dispatch = useDispatch();
    
    return (
        <div className="w-full min:h-dvh flex flex-col items-center justify-center mb-20">
            <div className="container flex-1">
                <h1 className="font-bold text-3xl mt-13">Shopping Cart</h1>
                <div className="mt-12">
                    <StatusBar status={"cart"} />
                </div>

                <div className="mt-20 ">
                    <CartItemsSection data={data}/>
                </div>

                <div className="border border-gray-300 flex flex-col w-full mt-16 h-128 rounded-xl text-xl px-28 py-16">
                   <PriceSummary needButton={true} needAdjustDiscountButton={false}/>
                </div>
            </div>
        </div>
    )
}

