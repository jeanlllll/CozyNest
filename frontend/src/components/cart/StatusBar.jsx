import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export const StatusBar = ({status}) => {
    return (
        <div className="flex flex-row py-2 w-full border-green justify-between">
            
            <div className={`flex flex-row items-center ml-10 ${status === "cart"? "text-buttonMain font-bold" : "text-gray-500"}`}>
                {status === "cart" ? <div classnam=""><TaskAltIcon/></div> : <div><CheckCircleOutlineIcon/></div>}
                <div className="">Cart</div>
            </div>

            <div className="w-120 border-t translate-y-1/2 border-gray-400"></div>

            <div className={`flex flex-row items-center ${status === "checkout"? "text-buttonMain" : "text-gray-500"}`}>
            {status === "checkout" ? <div><TaskAltIcon/></div> : <div><CheckCircleOutlineIcon/></div>}
                <div className="">CheckOut</div>
            </div>

            <div className="w-125  border-t translate-y-1/2 border-gray-400"></div>

            <div className={`flex flex-row items-center ${status === "paymentSummary"? "text-buttonMain" : "text-gray-500"}`}>
            {status === "paymentSummary" ? <div><TaskAltIcon/></div> : <div><CheckCircleOutlineIcon/></div>}
                <div className="">Payment Summary</div>
            </div>
        </div>
    )
}