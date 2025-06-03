import type React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import MainProductsPart from "../shop/MainProductsPart";

export interface Color {
  name: string;
  colorCode: string;
  priceMultiplier: number;
  outlinecolor: string;
}

export interface Product {
  _id?: number;
  name?: string;
  category?: string;
  main_image?: string;
  special_price?: number;
  price: number;
  badge?: string;
  colors?: Color[];
  sizes?: string[];
  variations?: string[];
  other_image?: string[];
  brand_name?: any;
  variants?: any;
  categories?: any;
  productype?: any;
}

export interface CartItem extends Product {
  // selectedColor: Color;
  // selectedSize: string;
  matchingVariation: any;
  quantity: number;
  uniqueId: number;
  selectedAttributes: any;
}
interface ProductProps {
  productsData: any;
  salesCategories: any;
  pageChange: any;
  productsStatuCount: any;
  shopFilterTypes: any;
}

const Sales: React.FC<ProductProps> = ({
  salesCategories,
  productsData,
  pageChange,
  productsStatuCount,
  shopFilterTypes,
}) => {
  return (
    <div className="text-black font-Outfit">
      {/* Top banner */}
      <div
        className="w-full h-52  sm:h-40 md:h-56 mb-4 sm:mb-8 md:mb-20"
        style={{
          backgroundImage: "url('/salebanner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-white text-center p-4 sm:p-8 md:p-16 container mx-auto">
          <h1 className="font-Racing text-yellow-400 text-3xl sm:text-4xl md:text-5xl">
            BLACK FRIDAY
          </h1>
          <div className="flex flex-col sm:flex-row font-Racing justify-between text-sm sm:text-base md:text-xl mt-2 sm:mt-4">
            <Link href="#" className="mb-2 sm:mb-0">
              Starting Now
            </Link>
            <h2 className="mb-2 sm:mb-0">EXTRA 40% OFF SALE</h2>
            <Link href="#" className="text-oran">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Promotional images */}
      <div className="flex flex-col sm:flex-row justify-evenly gap-4 px-4 sm:px-8 mb-8 container mx-auto">
        {["/sale1.png", "/sale2.png", "/sale3.png"].map((image, index) => (
          <div
            key={index}
            className="md:h-96  md:w-96 w-full h-96 flex items-end rounded-lg mb-4 sm:mb-0"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="text-white flex items-center p-4 sm:p-10 text-xl sm:text-2xl font-bold">
              <Link href="#">Shop Now</Link>
              <ArrowRight className="ml-2" />
            </div>
          </div>
        ))}
      </div>
      <MainProductsPart
        salesCategories={salesCategories}
        productsData={productsData}
        pageChange={pageChange}
        productsStatuCount={productsStatuCount}
        shopFilterTypes={shopFilterTypes}
      />
    </div>
  );
};

export default Sales;
