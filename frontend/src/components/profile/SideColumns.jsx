import { useNavigate } from "react-router";

export const SideColumns = ({ type, isEnglish }) => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="hidden sm:block ml-8 sm:w-40">
                <div className={`border border-buttonMain bg-buttonMain text-xl text-white px-2 py-2 rounded-lg text-center cursor-pointer
                ${type === "profile" ? "" : "opacity-50 hover:opacity-100"}
                `}
                    onClick={() => navigate("/user/profile")}
                >
                    {isEnglish ? "Profile" : "個人資料"}
                </div>
                <div className={`mt-6 border border-buttonMain bg-buttonMain text-xl text-white px-2 py-2 rounded-lg text-center cursor-pointer
                ${type === "order" ? "" : "opacity-50 hover:opacity-100"}
                `}
                    onClick={() => navigate("/user/orders")}
                >
                    {isEnglish ? "Order" : "訂單"}
                </div>
            </div>

            <div className="sm:hidden w-80">
                <div className="flex flex-row gap-5">
                    <div className={`basis-1/2 border border-buttonMain bg-buttonMain text-xl text-white px-2 py-2 rounded-lg text-center cursor-pointer
                ${type === "profile" ? "" : "opacity-50 hover:opacity-100"}
                `}
                        onClick={() => navigate("/user/profile")}
                    >
                        {isEnglish ? "Profile" : "個人資料"}
                    </div>
                    <div className={`basis-1/2 border border-buttonMain bg-buttonMain text-xl text-white px-2 py-2 rounded-lg text-center cursor-pointer
                ${type === "order" ? "" : "opacity-50 hover:opacity-100"}
                `}
                        onClick={() => navigate("/user/orders")}
                    >
                        {isEnglish ? "Order" : "訂單"}
                    </div>
                </div>
            </div>
        </div>
    )
}