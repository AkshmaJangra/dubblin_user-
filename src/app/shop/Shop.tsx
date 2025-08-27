import type React from "react";
import MainProductsPart from "./MainProductsPart";

export interface Color {
  name: string;
  colorCode: string;
  priceMultiplier: number;
  outlinecolor: string;
}

export interface Product {
  _id?: any;
  slug?: string;
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
  matchingVariation: any;
  quantity: number;
  uniqueId: number;
  // selectedAttributes: any;
  buyNow?: boolean;
  // _id?: string;
}
interface ProductProps {
  productsData: any;
  salesCategories: any;
  pageChange: any;
  productsStatuCount: any;
  shopFilterTypes: any;
  colorData: any;
  singleCategory: any;
}
const Shop: React.FC<ProductProps> = ({
  salesCategories,
  productsData,
  pageChange,
  productsStatuCount,
  shopFilterTypes,
  singleCategory,
  colorData,
}) => {
  return (
    <div className="text-black font-Outfit">
      {/* Top banner */}
      <div className="relative w-full h-32 sm:h-40 md:h-56  ">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/shopbanner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative text-white p-12 sm:p-8 md:p-20">
          <div className="flex items-center text-sm sm:text-base"></div>
          <div className="text-xl sm:text-2xl md:text-4xl  text-center">
            {singleCategory?.name ?? "Shop"}
          </div>
        </div>
      </div>
      {/* <p className="px-2 text-center py-6 sm:py-4">
        {singleCategory?.short_description ?? ""}
      </p> */}
      {/* Main content */}
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

export default Shop;
