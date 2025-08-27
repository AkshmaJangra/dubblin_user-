"use client";

import { useState, useMemo, useRef, useEffect } from "react";

import { addItems } from "../../../lib/AllSlices/cartSlice";
import React from "react";
import ProductAttributes from "../../Components/ProductAttributes";
import { useAppDispatch } from "../../../lib/hooks";
import NewArrivals from "../../Components/NewArrivels";
import Faqpage from "../../faq/page";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/store";
import { fetchRelatedProductsData } from "../../../lib/AllSlices/productsSlice";
interface Product {
  _id?: number;
  name?: string;
  category?: string;
  main_image?: string;
  special_price?: number;
  price: number;
  badge?: string;
  variations?: string[];
  other_image?: string[];
  brand_name?: any;
  variants?: any;
  categories?: any;
  model_no?: string;
  slug?: string;
  attributes?: any;
  stockManagement?: any;
  manufacture?: string;
  hsn_code?: string;
  description?: any;
}

interface Bottle {
  id: number;
  image: string;
  basePrice: number;
}

interface Color {
  name: string;
  colorCode: string;
  priceMultiplier: number;
  outlinecolor: string;
}
interface ProductProps {
  productData: Product;
  allProducts: Product[];
  newArrivelstitle: any;
  productFaq: any;
}
export interface CartItem extends Product {
  selectedColor: Color;
  selectedSize: string;
  quantity: number;
  uniqueId: number;
  matchingVariation: any;
}

const ProductDetails: React.FC<ProductProps> = ({
  productData,
  allProducts,
  newArrivelstitle,
  productFaq,
}) => {
  const dispatch = useAppDispatch();
  const { data: relatedproducts } = useSelector(
    (state: RootState) => state.productsdata.relatedProductsState
  );
  const categoryIds =
    productData?.categories?.map((category: any) => category._id) || [];

  const relatedContentTitle = {
    title: "You may also like",
    // description:
    //   "Explore similar products you might like based on your interests and preferences.",
  };

  const [showCart, setShowCart] = useState<boolean>(false);
  const addToCart = (
    product: Product,
    matchingVariation: any,
    quantity: number,
    selectedAttributes: any,
    buyNow?: boolean
  ): void => {
    const newItem: CartItem = {
      ...product,
      matchingVariation,
      quantity: quantity,
      buyNow: buyNow || false,
      uniqueId: Date.now(),
    };
    dispatch(addItems(newItem));
  };

  const buyNow = (
    product: Product,
    matchingVariation: any,
    quantity: number,
    uniqueId: any
  ): void => {
    addToCart(product, matchingVariation, quantity, {}, true);
  };

  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: any;
  }>({});
  useEffect(() => {
    const defaultAttributes: { [key: string]: any } = {};
    productData?.attributes.forEach((attribute: any) => {
      if (attribute.values && attribute.values.length > 0) {
        defaultAttributes[attribute.type.name.toLowerCase()] =
          attribute.values[0]._id;
      }
    });
    setSelectedAttributes(defaultAttributes);
  }, [productData]);

  const doesVariationMatch = (variation: any): boolean => {
    return Object.keys(selectedAttributes).every((key) => {
      return variation.values.some(
        (value: any) => value._id === selectedAttributes[key]
      );
    });
  };
  const matchingVariation = productData?.variants?.find(doesVariationMatch);
  const accordionData = productFaq;
  const [open, setOpen] = useState(1);
  const contentRefs = useRef({});

  const toggleAccordion = (index) => {
    setOpen(open === index ? null : index);
  };

  useEffect(() => {
    dispatch(fetchRelatedProductsData({ categoryIds }));
  }, [dispatch]);

  useEffect(() => {
    // Update height for all panels
    accordionData.forEach((_, index: any) => {
      const content = contentRefs.current[index];
      if (content) {
        if (open === index) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        } else {
          content.style.maxHeight = "0px";
        }
      }
    });
  }, [open]);

  //to captalize the word
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      {/* <h1 className="text-center text-4xl my-6 text-black font-Outfit">
        Product Details
      </h1> */}
      <div className="flex flex-wrap mx-auto container pt-10 font-Outfit">
        <ProductAttributes
          product={productData}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          matchingVariation={matchingVariation}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col font-Outfit items-center p-4">
        <div className="container mx-auto mt-7 w-full">
          <div className="text-2xl md:text-3xl  text-black font-bold mb-2">
            <h1 className="text-left">Description</h1>
          </div>
          <div
            className="text-black text-justify py-2 px-2 md:px-4"
            dangerouslySetInnerHTML={{
              __html: (productData?.description || "")
                .replace(/\\n/g, " ") // handles literal "\\n"
                .replace(/\n/g, " "), // handles real line breaks
            }}
          />
        </div>
        {/* <hr className="border-t-2 border-black w-full " /> */}

        <div className="container mt-6 flex flex-col uppercase justify-center items-center md:flex-row w-full">
          <div className="bg-white space-y-4 text-sm sm:text-base md:text-lg w-full md:w-full lg:w-3/4 px-3 md:px-0">
            {productData?.attributes.map((item: any) => (
              <div
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 py-2"
                key={item?._id}
              >
                <strong className="text-gray-700 uppercase mb-1 sm:mb-0">
                  {item?.type?.name}
                </strong>
                <div className="sm:text-right">
                  {item?.values?.map((value: any, index: number) => (
                    <React.Fragment key={value?._id}>
                      <span className="text-slate-500 font-semibold px-1 uppercase">
                        {capitalizeWords(value?.short_name || "")}
                        {index < item.values.length - 1 ? "," : ""}
                      </span>
                      {(index + 1) % 3 === 0 &&
                        index !== item.values.length - 1 && (
                          <span className="sm:hidden">
                            <br />
                          </span>
                        )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row up sm:justify-between sm:items-center border-b-2 py-2">
              <strong className="text-gray-700 mb-1 sm:mb-0">Brand</strong>
              <span className="text-slate-500 font-semibold sm:text-right">
                {productData?.brand_name?.name}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 py-2">
              <strong className="text-gray-700 mb-1 sm:mb-0">
                Item Weight
              </strong>
              <span className="text-slate-500 font-semibold sm:text-right">
                {matchingVariation?.weight} Grams
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 py-2">
              <strong className="text-gray-700 mb-1 sm:mb-0">
                Item Dimensions LxWxH
              </strong>
              <span className="text-slate-500 font-semibold sm:text-right">
                {matchingVariation?.length} X {matchingVariation?.breadth} X
                {matchingVariation?.height} Centimetres
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 py-2">
              <strong className="text-gray-700 mb-1 sm:mb-0">
                Manufacturer
              </strong>
              <span className="text-slate-500 font-semibold capitalize sm:text-right">
                {productData?.manufacture}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 py-2">
              <strong className="text-gray-700 mb-1 sm:mb-0">
                Item Model Number
              </strong>
              <span className="text-slate-500 font-semibold sm:text-right">
                {productData?.model_no}
              </span>
            </div>
            {/* <div className="flex justify-between items-center">
        <strong className="text-gray-700">Product Dimensions</strong>
        <span className="text-slate-500 font-semibold">
          9 x 9 x 29.5 cm; 410 Grams
        </span>
      </div> */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 py-2">
              <strong className="text-gray-700 mb-1 sm:mb-0">ASIN</strong>
              <span className="text-slate-500 font-semibold sm:text-right">
                {productData?.hsn_code}
              </span>
            </div>
          </div>
        </div>
      </div>

      <NewArrivals
        newArrivels={relatedproducts}
        newArrivelstitle={relatedContentTitle}
      />
      {productFaq.length == 0 ? null : (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-black text-center mb-20 text-4xl font-bold font-Cinzel">
              Frequently Asked Questions
            </h1>
            <div id="accordion-open">
              {accordionData.map((item: any, index: number) => (
                <div
                  key={index}
                  className="font-Outfit mb-4 border border-gray-100 rounded-lg overflow-hidden"
                >
                  <h2>
                    <button
                      type="button"
                      className="flex items-center justify-between w-full p-3 font-medium border border-gray-200 hover:bg-gray-50 gap-3 rounded-t"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={open === index}
                      aria-controls={`accordion-body-${index}`}
                    >
                      <span className="flex items-center text-xl">
                        <svg
                          className="w-5 h-5 me-2 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item.question}
                      </span>
                      <svg
                        className={`w-3 h-3 shrink-0 transform transition-transform duration-300 ease-in-out ${
                          open === index ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 10 6"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5 5 1 1 5"
                        />
                      </svg>
                    </button>
                  </h2>
                  <div
                    ref={(el) => {
                      contentRefs.current[index] = el;
                    }}
                    id={`accordion-body-${index}`}
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{ maxHeight: "0px" }}
                  >
                    <div className="p-3 border border-t-0 border-gray-200 bg-white">
                      {item?.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
