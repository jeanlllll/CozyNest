import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMinPrice, setMaxPrice } from "../../store/features/filtersSlice";

export const PriceSlider = ({ category, filters, isEnglish }) => {
  const dispatch = useDispatch();
  const priceUpdateTimeoutRef = useRef(null);

  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);

  const handleChangeOnMin = (e) => {
    const newMin = Number(e.target.value);
    if (newMin > localMaxPrice) {
      setLocalMinPrice(localMaxPrice);
      setLocalMaxPrice(newMin);
    } else {
      setLocalMinPrice(newMin);
    }
  };

  const handleChangeOnMax = (e) => {
    const newMax = Number(e.target.value);
    if (newMax < localMinPrice) {
      setLocalMaxPrice(localMinPrice);
      setLocalMinPrice(newMax)
    } else {
      setLocalMaxPrice(newMax);
    }
  };

  // Only update Redux state with debouncing
  useEffect(() => {
    if (priceUpdateTimeoutRef.current) {
      clearTimeout(priceUpdateTimeoutRef.current);
    }

    priceUpdateTimeoutRef.current = setTimeout(() => {
      dispatch(setMinPrice(localMinPrice));
      dispatch(setMaxPrice(localMaxPrice));
    }, 300);

    return () => {
      if (priceUpdateTimeoutRef.current) {
        clearTimeout(priceUpdateTimeoutRef.current);
      }
    };
  }, [localMinPrice, localMaxPrice, dispatch]);

  // Sync with external price changes
  useEffect(() => {
    if (filters.minPrice !== localMinPrice) {
      setLocalMinPrice(filters.minPrice);
    }
    if (filters.maxPrice !== localMaxPrice) {
      setLocalMaxPrice(filters.maxPrice);
    }
  }, [filters.minPrice, filters.maxPrice]);

  // Handle mobile input validation
  const handleMobileInput = (e, setter) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 300)) {
      setter(Number(value) || 0);
    }
  };

  return (
    <>
      <div className="hidden sm:block w-full">
        <div className="flex justify-between text-md font-medium text-gray-800 mb-2">
          <span>{isEnglish ? "Price" : "價格"}</span>
          <span>${localMinPrice} - ${localMaxPrice}+</span>
        </div>

        <div className="relative h-10">
          {/* Track */}
          <div className="absolute top-1/2 left-0 w-full h-1 rounded -translate-y-1/2 z-0 bg-red-300" />

          {/* Min Slider */}
          <input
            type="range"
            min="0"
            max="300"
            value={localMinPrice}
            onChange={handleChangeOnMin}
            className="absolute top-0 w-full h-10 appearance-none bg-transparent z-20 cursor-pointer
            pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-black"
          />

          {/* Max Slider */}
          <input
            type="range"
            min="0"
            max="300"
            value={localMaxPrice}
            onChange={handleChangeOnMax}
            className="absolute top-0 w-full h-10 appearance-none bg-transparent z-20 cursor-pointer
            pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-black"
          />
        </div>
      </div>

      {/* mobile verion */}
      <div className="sm:hidden flex flex-rows text-sm">
        <span className="pr-2 text-gray-600 flex items-center">HKD</span>

        <input
          type="number"
          name="minPrice"
          onChange={(e) => handleMobileInput(e, setLocalMinPrice)}
          value={localMinPrice}
          className="w-16 px-2 border border-gray-300 text-sm focus:outline-none focus:border-2 focus:border-gray-700 hover:outline-gray-700 rounded"
          min={0}
          max={300}
        />

        <span className="px-3 flex items-center">{isEnglish ? "to" : "至"}</span>

        <input
          type="number"
          name="maxPrice"
          onChange={(e) => handleMobileInput(e, setLocalMaxPrice)}
          value={localMaxPrice}
          className="w-16 px-2 border border-gray-300 text-sm focus:outline-none focus:border-2 focus:border-gray-700 hover:outline-gray-700 rounded"
          min={0}
          max={300}
        />
      </div >

    </>
  );
};