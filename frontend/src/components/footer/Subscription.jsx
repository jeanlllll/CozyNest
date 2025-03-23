export const Subscription = () => {
    return (
        <div className="relative w-56 sm:w-64">
            {/* Email Input */}
            <input 
                type="email"
                placeholder="you@example.com"
                className="w-full pl-3 py-[6px] pr-21 sm:pr-24 rounded-lg bg-white border border-gray-400 focus:outline-none focus:border-gray-400" 
            />

            {/* Submit Button */}
            <button className="absolute py-[6.3px] px-4  top-0.4 right-[1px] bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer">Submit</button>

        </div>
        
    )
}