export const SizeButton = ({isAvailable, index, size}) => {
    return (
        <div
            key={index}
            className={`relative w-18 py-2 rounded-md text-white text-center mr-3 drop-shadow-lg
                                        ${isAvailable ? "bg-buttonMain hover:bg-gray-800 cursor-pointer" :
                    "bg-gray-400 opacity-50 cursor-not-allowed"}`}
        >
            {size}
            {!isAvailable && (
                <div className="absolute left-0 top-1/2 w-full border-t-2 border-white transform -rotate-20"></div>
            )}
        </div>
    )

}