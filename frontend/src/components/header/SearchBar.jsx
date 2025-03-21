export const SearchBar = () => {
    return (

        <div className="relative block md:hidden lg:block">

            <input type="text"
                id="default-search"
                className="block w-36 sm:w-40 p-2 ps-5 pr-10 text-sm text-gray-500 border border-gray-200 
                    rounded-full bg-white
                    focus:border-gray-400 focus:outline-none"
                placeholder="Search"
                required />

            <div class="absolute flex items-center top-2.5 right-4 pointer-events-none">

                <svg class="w-4 h-4 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>

            </div>
        </div>
    )
};

