"use client";
import { X } from "lucide-react";
import ProductAttributes from "./ProductAttributes";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Color {
  name: string;
  colorCode: string;
  priceMultiplier: number;
  outlinecolor: string;
}

interface Product {
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
  model_no?: string;
  slug?: string;
  attributes?: any;
  stockManagement?: any;
}

interface ProductEachProps {
  product: Product;
  onAddToCart: (
    product: Product,
    matchingVariation: any,
    quantity: number,
    uniqueId: any
  ) => void;
  onBuyNow: (
    product: Product,
    matchingVariation: any,
    quantity: number,
    uniqueId: any
  ) => void;
  onClose: () => void;
}

const ProductEach: React.FC<ProductEachProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onClose,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: any;
  }>({});
  const router = useRouter();

  const doesVariationMatch = (variation: any): boolean => {
    return Object.keys(selectedAttributes).every((key) => {
      return variation.values.some(
        (value: any) => value._id === selectedAttributes[key]
      );
    });
  };

  const matchingVariation = product?.variants?.find(doesVariationMatch);

  return (
    <div
      className="bg-white container mx-auto h-screen  w-screen md:m-3 m-0 overflow-y-scroll justify-evenly p-2"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div className="text-xl p-2 px-5 flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="flex flex-wrap">
        <ProductAttributes
          product={product}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          matchingVariation={matchingVariation}
        />
      </div>
    </div>
  );
};

export default ProductEach;
