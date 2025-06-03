import React from "react";
import Slider from "react-slider";

const PriceRangeSlider = ({ setPriceRange, priceRange }) => {
  const handlePriceRangeChange = (values: any) => {
    setPriceRange(values);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Price Range</h2>

      {/* Slider */}
      <Slider
        className="w-full h-2 bg-gray-200 rounded-full relative"
        thumbClassName="w-3 h-3 bg-pink-600 rounded-full cursor-pointer focus:outline-none"
        trackClassName="h-2 bg-pink-600 rounded-full"
        value={priceRange}
        onChange={handlePriceRangeChange}
        min={0}
        max={10001}
        step={1}
      />

      {/* Input Fields */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label
            htmlFor="min-price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
              ₹
            </span>
            <input
              type="number"
              id="min-price"
              className="form-input pl-7 w-24 rounded-md border-gray-300"
              value={priceRange[0]}
              onChange={(e) =>
                handlePriceRangeChange([Number(e.target.value), priceRange[1]])
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="max-price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
              ₹
            </span>
            <input
              type="text"
              id="max-price"
              className="form-input pl-7 w-24 rounded-md border-gray-300"
              value={priceRange[1] > 10000 ? "10000+" : priceRange[1]}
              onChange={(e) => {
                const value =
                  e.target.value === "10000+"
                    ? Infinity
                    : Number(e.target.value);
                handlePriceRangeChange([priceRange[0], value]);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
