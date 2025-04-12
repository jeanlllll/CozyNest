import { TickIcon } from "../assets/icons/TickIcon";

export const CustomButton = ({ value, isChecked, onChangeFunc, color, widthNheight}) => {
    const colorClass = {
        black: "checked:bg-black checked:border-black",
        thirdPrimary: "checked:bg-thirdPrimary checked:border-thirdPrimary",
        gray: "checked:bg-gray-800 checked:border-gray-800",
    };

    const sizeClass = `w-${widthNheight} h-${widthNheight} sm:w-${widthNheight} sm:h-${widthNheight}`;
    
    return (
        <label className={`relative ${sizeClass} cursor-pointer block`}>
            <input
                type="checkbox"
                checked={isChecked || false}
                onChange={onChangeFunc}
                className={`absolute inset-0 appearance-none ${sizeClass} border bg-transparent border-gray-300 cursor-pointer
                    ${colorClass[color]}
                    rounded z-10 flex justify-center items-center 
                    hover:border-gray-400 transition-colors duration-200`}
            />
            {isChecked && (
                <div className="absolute inset-0 flex items-center justify-center p-0.5 z-20 pointer-events-none text-white">
                    <TickIcon className="w-full h-full" />
                </div>
            )}
        </label>
    );
}