import React from "react";

export default function SaleStatus({ salestatus, setSaleStatus }) {
  return (
    <div className="w-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-gray-700">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-pink-600"
              checked={salestatus}
              onChange={() => setSaleStatus(!salestatus)}
            />
            <span className="ml-2 text-black">Discounted</span>
          </label>
          {/* <span className="text-sm text-gray-500">
            ( {productsStatuCount?.outStockCount})
          </span> */}
        </div>
      </div>
    </div>
  );
}
