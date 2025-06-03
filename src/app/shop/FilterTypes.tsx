import { Check } from "lucide-react";
import React from "react";
export default function FilterTypes({
  shopFilterTypes,
  selectedColors,
  setSelectedSizes,
  selectedSizes,
  setSelectedColors,
}) {
  const handleColorSelect = (color: string) => {
    setSelectedColors((prev: any) =>
      prev.includes(color)
        ? prev.filter((c: any) => c !== color)
        : [...prev, color]
    );
  };
  const [filtersize, setFilterSize] = React.useState(4);
  const [filtercolor, setFilterColor] = React.useState(5);
  const handleSizeSelect = (size: string) => {
    setSelectedSizes((prev: any) =>
      prev.includes(size)
        ? prev.filter((s: any) => s !== size)
        : [...prev, size]
    );
  };
  return (
    <>
      {shopFilterTypes?.map((type: any, index: any) => (
        <div className="w-full" key={index}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 capitalize">
            {type?.name}
          </h2>

          {type?.type === "color" ? (
            <div className="flex flex-wrap gap-2">
              {type?.filterValues
                ?.map((item: any) => (
                  <button
                    key={item._id}
                    className={`w-8 h-8 rounded-full border-2 relative flex items-center justify-center transition-colors duration-200 ${
                      selectedColors.includes(item?._id)
                        ? "border-gray-400"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleColorSelect(item?._id)}
                    style={{ backgroundColor: item?.short_name }}
                  >
                    {selectedColors.includes(item._id) && (
                      <Check className="absolute text-black w-10 h-4" />
                    )}
                  </button>
                ))
                .slice(0, filtercolor)}
              <p
                onClick={() => {
                  if (filtercolor === 5) {
                    setFilterColor(type?.filterValues?.length);
                  } else {
                    setFilterColor(5);
                  }
                }}
                className="text-pink-600 cursor-pointer"
              >
                {filtercolor === 5 ? "see more" : "see less"}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="space-y-2">
                {type?.filterValues
                  ?.sort(function (a: any, b: any) {
                    return a.short_name - b.short_name;
                  })
                  ?.map((size: any, index: any) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-pink-600"
                          checked={selectedSizes.includes(size?._id)}
                          onChange={() => handleSizeSelect(size?._id)}
                        />
                        <span className="ml-2 text-gray-700">
                          {size?.short_name} ml
                        </span>
                      </label>
                    </div>
                  ))
                  .slice(0, filtersize)}
              </div>
              <p
                onClick={() => {
                  if (filtersize === 4) {
                    setFilterSize(type?.filterValues?.length);
                  } else {
                    setFilterSize(4);
                  }
                }}
                className="text-pink-600 cursor-pointer"
              >
                {filtersize === 4 ? "see more" : "see less"}
              </p>
            </div>
          )}
          <hr className="mt-5 w-full border-t-2" />
        </div>
      ))}
    </>
  );
}
