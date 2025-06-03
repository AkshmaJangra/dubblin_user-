import React from "react";

export default function BestSelling({ bestSelling, setBestSelling }) {
  return (
    <div className="w-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-gray-700">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-pink-600"
              checked={bestSelling}
              onChange={() => setBestSelling(!bestSelling)}
            />
            <span className="ml-2 text-black">Best Selling</span>
          </label>
        </div>
      </div>
    </div>
  );
}
