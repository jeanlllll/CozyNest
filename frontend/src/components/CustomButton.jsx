import { TickIcon } from "../assets/icons/TickIcon";

export const CustomButton = ({ value, isChecked, onChange}) => {

    return (
        <div className="relative w-4 h-4">
            <input
                id={value}
                type="checkbox"
                name="categoryType"
                value={value}
                checked={isChecked}
                onChange={onChange}
                className="absolute inset-0 appearance-none w-4 h-4 border bg-transparent border-gray-300 cursor-pointer drop-shadow-xs
                    checked:bg-black checked:border-black
                    rounded z-0"
            />


            {isChecked &&
                <div className="absolute inset-0 flex items-center justify-center p-0.5 z-10">
                    <TickIcon />
                </div>}

        </div>
    )
}