import { Outlet } from "react-router-dom"
import { EntireHeader } from "../components/header/EntireHeader.jsx"
import { EntireFooter } from "../components/footer/EntireFooter.jsx"
import { useParams } from "react-router-dom"

export const ShopApplicationWrapper = ({ needSearchBar }) => {
    const {category} = useParams();

    return (
        <div className="font-inter">
            <EntireHeader needSearchBar={needSearchBar} />
            <Outlet />
            <EntireFooter />
        </div>
    )
}