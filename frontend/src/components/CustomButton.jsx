import { TickIcon } from "../assets/icons/TickIcon";

export const CustomButton = ({ value, isChecked, onChangeFunc, color, widthNheight}) => {

    const colorClass = {
        black: "checked:bg-black checked:border-black",
        thirdPrimary: "checked:bg-thirdPrimary checked:border-thirdPrimary",
        gray: "checked:bg-gray-800 checked:border-gray-800",
      };

    const widthNHeigth = `w-${widthNheight} h-${widthNheight}`
    
    return (
        <div className={`relative ${widthNHeigth} cursor-pointer`} onClick={() => onChangeFunc()}>
            <input
                id={value}
                type="checkbox"
                name="categoryType"
                value={value}
                checked={isChecked}
                className={`absolute inset-0 appearance-none ${widthNHeigth} border bg-transparent border-gray-300 cursor-pointer drop-shadow-xs
                    ${colorClass[color]}
                    rounded z-10 flex justify-center items-center`}
            />


            {isChecked &&
                <div className="absolute inset-0 flex items-center justify-center p-0.5 z-10 text-white">
                    <TickIcon />
                </div>}

        </div>
    )
}