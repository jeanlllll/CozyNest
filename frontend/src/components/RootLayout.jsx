import { useEffect } from "react"
import { fetchCheckIsLogin } from "../api/fetchCheckIsLogin"
import { useDispatch } from "react-redux"
import { setIsLogin } from "../store/features/authSlice"
import { Outlet } from "react-router"

export const RootLayout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyLoign = async () => {
            try {
                const response = await fetchCheckIsLogin();
                if (response.status === 200) {
                    dispatch(setIsLogin(response.data.isLogin));
                }
            } catch (error) {
                dispatch(setIsLogin(false));
            }
        }
        verifyLoign();

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth", // optional: smooth scrolling
        });
    }, [])


    return (
        <div>
            <div>
                <Outlet />
            </div>
        </div>

    )
}