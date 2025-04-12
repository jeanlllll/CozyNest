import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export const ProtectedLayout = () => {
    const isLogin = useSelector((state) => state.auth.isLogin);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            return navigate("/user/login")
        }
    })

    if (!isLogin) {
        return null;
    }
    
    return <Outlet />
}