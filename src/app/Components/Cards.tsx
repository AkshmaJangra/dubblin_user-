"use client";
import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Cards({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Maintain original price calculation logic
  let mrp = 0;
  let maxprice = 0;
  let minprice = 0;
  if (product?.productype === "variableproduct") {
    if (product?.variants?.length > 1) {
      const prices = product.variants.map(
        (variant) => variant.special_price || 0
      );

      mrp = Math.max(...prices);
      maxprice = Math.max(...prices);
      minprice = Math.min(...prices);
    } else {
      mrp = product?.variants[0]?.price;
      maxprice = product?.variants[0]?.special_price;
      minprice = product?.variants[0]?.special_price;
    }
  } else {
    mrp = product?.variants[0]?.price;
    maxprice = product?.variants[0]?.special_price;
    minprice = product?.variants[0]?.special_price;
  }

  let discount = 0;
  if (
    product?.productype === "variableproduct" &&
    product?.variants?.length > 1
  ) {
    discount = 0;
  } else {
    discount = mrp > minprice ? Math.round(((mrp - minprice) / mrp) * 100) : 0;
  }

  const handleNavigate = () => {
    router.push(`/product/${product?.slug}`);
  };
  return (
    <div
      className="group border relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        // setCurrentImageIndex(0); // Reset to first image when not hovering
      }}
      onClick={handleNavigate}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Product Image */}
        <img
          src={product.main_image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:hidden"
        />

        <img
          src={product.second_main_image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:block"
        />

        {/* Image Navigation Dots */}
        {/* {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index
                    ? "bg-pink-600 w-4"
                    : "bg-gray-200 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )} */}

        {/* Quick Action Buttons */}
        <div
          className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-pink-50 transition-colors"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'fill-pink-500 stroke-pink-500' : 'stroke-gray-600'}`} 
            />
          </button> */}
          <button
            className="bg-white  p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
            onClick={handleNavigate}
          >
            <Eye className="w-4 h-4 stroke-gray-600" />
          </button>
        </div>

        {/* Discount Badge */}

        {product?.badge ||
          (product?.best_selling && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
              {product.badge ?? "Best Selling"}
            </div>
          ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-medium text-gray-700 mb-1 line-clamp-2 group-hover:text-pink-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product?.productype === "variableproduct" &&
            product?.variants?.length > 1 ? (
              <div className="text-base font-bold text-gray-900">
                {minprice === maxprice ? (
                  <>₹{minprice?.toFixed(2)}</>
                ) : (
                  <>
                    ₹{minprice?.toFixed(2)} - ₹{maxprice?.toFixed(2)}
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-gray-900">
                  ₹{minprice?.toFixed(2)}
                </span>
                {mrp > minprice && (
                  <span className="text-xs text-gray-500 line-through">
                    ₹{mrp?.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Button (Replacing Rating) */}
          <button className="bg-gray-900 hover:bg-pink-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
