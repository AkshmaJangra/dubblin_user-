import React from "react";

export default function Availability({ productsStatuCount }) {
  return (
    <div className="w-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-gray-700">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-pink-600"
              // checked={selectedAvailability.includes(option)}
              // onChange={() => handleAvailabilityChange(option)}
            />

            <span className="ml-2 text-black">In Stock Only</span>
          </label>
          {/* <span className="text-sm text-gray-500">
            ({productsStatuCount?.inStockCount})
          </span> */}
        </div>
      </div>
    </div>
  );
}
