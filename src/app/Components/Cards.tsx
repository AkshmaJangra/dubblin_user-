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
  // let mrp = 0;
  // let maxprice = 0;
  // let minprice = 0;
  // if (product?.productype === "variableproduct") {
  //   if (product?.variants?.length > 1) {
  //     const prices = product.variants.map(
  //       (variant) => variant.special_price || 0
  //     );

  //     mrp = Math.max(...prices);
  //     maxprice = Math.max(...prices);
  //     minprice = Math.min(...prices);
  //   } else {
  //     mrp = product?.variants[0]?.price;
  //     maxprice = product?.variants[0]?.special_price;
  //     minprice = product?.variants[0]?.special_price;
  //   }
  // } else {
  //   mrp = product?.variants[0]?.price;
  //   maxprice = product?.variants[0]?.special_price;
  //   minprice = product?.variants[0]?.special_price;
  // }

  // let discount = 0;
  // if (
  //   product?.productype === "variableproduct" &&
  //   product?.variants?.length > 1
  // ) {
  //   discount = 0;
  // } else {
  //   discount = mrp > minprice ? Math.round(((mrp - minprice) / mrp) * 100) : 0;
  // }

 // Calculate prices and discounts
 let minPrice = 0;
 let originalPrice = 0;
 let discount = 0;

 if (product?.productype === "variableproduct") {
   if (product?.variants?.length > 1) {
     
     const variantsWithPrices = product.variants.filter(v => v.special_price && v.special_price > 0);
     
     if (variantsWithPrices.length > 0) {
       
       const sortedVariants = [...variantsWithPrices].sort((a, b) => 
         (a.special_price || 0) - (b.special_price || 0)
       );
      
       const lowestPriceVariant = sortedVariants[0];
       minPrice = lowestPriceVariant.special_price;
       originalPrice = lowestPriceVariant.price;
    
       discount = originalPrice > minPrice ? 
         Math.round(((originalPrice - minPrice) / originalPrice) * 100) : 0;
     }
   } else if (product?.variants?.length === 1) {
     
     minPrice = product.variants[0]?.special_price;
     originalPrice = product.variants[0]?.price;
     discount = originalPrice > minPrice ? 
       Math.round(((originalPrice - minPrice) / originalPrice) * 100) : 0;
   }
 } else {

   minPrice = product?.variants[0]?.special_price;
   originalPrice = product?.variants[0]?.price;
   discount = originalPrice > minPrice ? 
     Math.round(((originalPrice - minPrice) / originalPrice) * 100) : 0;
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
          <div>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="md:text-lg text-base font-bold text-gray-900">
                ₹{minPrice?.toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                <span className="text-gray-500 text-sm line-through">
                ₹{originalPrice}
                </span>
                  <span className="text-lg font-medium text-[#AA0A30]">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
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
