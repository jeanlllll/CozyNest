import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMinPrice, setMaxPrice } from "../../store/features/filtersSlice";
import { useEffect } from "react";
import { fitlersToStringParams } from "../../Helper/filtersToStringParams";
import { useNavigate } from "react-router";

export const PriceSlider = ({ category, filters, isEnglish }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [localMinPrice, setLocalMinPrice] = useState(0);
  const [localMaxPrice, setLocalMaxPrice] = useState(300);

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

  const handleSliderRelease = () => {
    dispatch(setMinPrice(localMinPrice));
    dispatch(setMaxPrice(localMaxPrice));
  }

  useEffect(() => {
    const queryString = fitlersToStringParams({ category, filters });
    navigate(`/category/${category}?${queryString}`);
  }, [filters.minPrice, filters.maxPrice]);

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
            onMouseUp={handleSliderRelease}
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
            onMouseUp={handleSliderRelease}
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
          type="text"
          name="minPrice"
          onChange={(e) => setLocalMinPrice(Number(e.target.value))}
          onBlur={handleSliderRelease}
          placeholder={`${localMinPrice}`}
          className="w-16 px-2 border border-gray-300 text-sm focus:outline-none focus:border-2 focus:border-gray-700 hover:outline-gray-700 rounded"
          min={0}
          max={300}
          maxLength={3}
        />

        <span className="px-3 flex items-center">{isEnglish ? "to" : "至"}</span>

        <input
          type="text"
          name="maxPrice"
          onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
          onBlur={handleSliderRelease}
          placeholder={`${localMaxPrice}`}
          className="w-16 px-2  border border-gray-300 text-sm focus:outline-none focus:border-2 focus:border-gray-700 hover:outline-gray-700 rounded"
          min={0}
          max={300}
          maxLength={3}
        />
      </div >

    </>
  );
};
