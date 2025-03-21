import { Outlet } from "react-router-dom"
import { EntireHeader } from "../components/header/EntireHeader.jsx"
import { EntireFooter } from "../components/footer/EntireFooter.jsx"

export const ShopApplicationWrapper = () => {
    return (
        <div className="font-inter">  
            <EntireHeader/>
            <Outlet/>
            <EntireFooter/>
        </div>
    )
}