import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useSelector } from 'react-redux';

export const StatusBar = ({status}) => {
    const language = useSelector((state) => state.language.language);
    const isEnglish = language === "en";

    return (
        <div className="flex items-center justify-center w-full py-4 sm:py-8">
            <div className="flex items-center justify-center w-full max-w-3xl px-4 sm:px-6">
                <div className="flex flex-col items-center">
                    <div className="flex items-center">
                        <div className={`flex items-center shrink-0 ${status === "cart" ? "text-buttonMain font-bold" : "text-gray-500"}`}>
                            {status === "cart" ? <TaskAltIcon className="text-xl sm:text-2xl" /> : <CheckCircleOutlineIcon className="text-xl sm:text-2xl" />}
                            <span className="ml-1 sm:ml-2 text-sm sm:text-base whitespace-nowrap">
                                {isEnglish ? "Cart" : "購物車"}
                            </span>
                        </div>

                        <div className="w-2 sm:w-130 mx-2 sm:mx-4">
                            <div className="h-[1px] w-full bg-gray-300"></div>
                        </div>

                        <div className={`flex items-center shrink-0 ${status === "checkout" ? "text-buttonMain font-bold" : "text-gray-500"}`}>
                            {status === "checkout" ? <TaskAltIcon className="text-xl sm:text-2xl" /> : <CheckCircleOutlineIcon className="text-xl sm:text-2xl" />}
                            <span className="ml-1 sm:ml-2 text-sm sm:text-base whitespace-nowrap">
                                {isEnglish ? "Check Out" : "結帳"}
                            </span>
                        </div>

                        <div className="w-2 sm:w-130 mx-2 sm:mx-4">
                            <div className="h-[1px] w-full bg-gray-300"></div>
                        </div>

                        <div className={`flex items-center shrink-0 ${status === "paymentSummary" ? "text-buttonMain font-bold" : "text-gray-500"}`}>
                            {status === "paymentSummary" ? <TaskAltIcon className="text-xl sm:text-2xl" /> : <CheckCircleOutlineIcon className="text-xl sm:text-2xl" />}
                            <span className="text-wrap ml-1 sm:ml-2 text-sm sm:text-base whitespace-nowrap">
                                {isEnglish ? "Payment Summary" : "付款摘要"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}