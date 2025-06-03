"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import ProductEach from "./ProductEach";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../lib/store";
import { addItems } from "../../lib/AllSlices/cartSlice";
import Cards from "./Cards";
import { fetchProductsData } from "../../lib/AllSlices/productsSlice";
import { useAppSelector } from "../../lib/hooks";
import { LoaderPagination } from "../sale/LoaderPagination";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "../shop/Shop";

interface Category {
  _id?: string;
  name?: string;
  slug?: string;
  banner_image?: string;
  light_logo_image?: string;
  dark_logo_image?: string;
}

export interface Color {
  name: string;
  colorCode: string;
  priceMultiplier: number;
  outlinecolor: string;
}

export interface CartItem extends Product {
  matchingVariation: any;
  quantity: number;
  uniqueId: number;
  // selectedAttributes: any;
  buyNow?: boolean;
  // _id?: string;
}

const Categories: React.FC<{
  categoriesData: Category[];
  homecategoriesData: any;
}> = ({ categoriesData, homecategoriesData }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { data, loading } = useAppSelector(
    (state) => state.productsdata.productsState
  );
  const filteredProducts = data?.productsdata;
  const totalCount = data?.totalCount;
  const router = useRouter();
  // Reference to the categories container for scrolling
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  const handleCategoryClick = (categoryId: string): void => {
    setActiveCategory(categoryId);
  };

  const openProductSelection = (product: Product): void => {
    router.push(`/product/${product?.slug}`);
    // setActiveProduct(product);
  };

  const closeProductSelection = (): void => {
    setActiveProduct(null);
  };

  // Scroll functions for the categories slider
  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

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
    closeProductSelection();
  };

  const buyNow = (
    product: Product,
    matchingVariation: any,
    quantity: number,
    uniqueId: any
  ): void => {
    addToCart(product, matchingVariation, quantity, {}, true);
  };

  useEffect(() => {
    dispatch(
      fetchProductsData({ search: "", limit: 8, categoryId: activeCategory })
    );
  }, [activeCategory, dispatch]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 text-black">
      <div className="text-center mt-12 ">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-Cinzel tracking-wider relative inline-block">
          {homecategoriesData?.title}
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-pink-600"></span>
        </h2>
        <div
          className="font-Outfit font-normal text-base md:text-lg text-center text-gray-600 mt-4 max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{
            __html: homecategoriesData?.description || "",
          }}
        />
      </div>

      <div className="relative">
        {/* Navigation buttons */}
        <button
          onClick={scrollLeft}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg p-2 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-pink-700" />
        </button>

        <div
          ref={categoriesRef}
          className="flex overflow-x-auto overflow-y-hidden scrollbar-hide justify-start gap-2 md:gap-8 px-8 md:px-12 py-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            key=""
            className={`flex flex-col font-Outfit items-center justify-center p-3 min-w-max transition-all duration-300 relative ${
              activeCategory === "all"
                ? "scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
            onClick={() => {
              handleCategoryClick("all"), setActiveCategorySlug("all");
            }}
          >
            <div
              className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                activeCategory === "all"
                  ? "bg-pink-50 shadow-md"
                  : "bg-gray-50 hover:bg-gray-100"
              } transition-all duration-300`}
            >
              <img
                src={activeCategory === "all" ? "/core1.png" : "/icon14.png"}
                alt="all"
                className="object-contain w-8 h-8 md:w-10 md:h-10 transition-all duration-300"
                sizes="(max-width: 768px) 48px, 64px"
              />
            </div>
            <span
              className={`mt-3 text-sm md:text-base text-center transition-all duration-300 ${
                activeCategory === "all"
                  ? "text-pink-700 font-medium"
                  : "text-gray-600"
              }`}
            >
              All Products
            </span>

            {activeCategory === "all" && (
              <div className="absolute -bottom-1 left-0 right-0 w-10 mx-auto h-0.5 bg-pink-600 rounded-full" />
            )}
          </button>

          {categoriesData.map((category) => (
            <button
              key={category._id}
              className={`flex flex-col font-Outfit items-center justify-center p-3 min-w-max transition-all duration-300 relative ${
                activeCategory === category._id
                  ? "scale-105"
                  : "opacity-80 hover:opacity-100"
              }`}
              onClick={() => {
                category._id && handleCategoryClick(category._id),
                  setActiveCategorySlug(category?.slug || "");
              }}
            >
              <div
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center  justify-center ${
                  activeCategory === category._id
                    ? "bg-pink-50 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100"
                } transition-all duration-300`}
              >
                <img
                  src={
                    activeCategory === category._id
                      ? category?.dark_logo_image
                      : category?.light_logo_image
                  }
                  alt={category?.name}
                  className="object-contain w-8 h-8 md:w-10 md:h-10 transition-all duration-300"
                  sizes="(max-width: 768px) 48px, 64px"
                />
              </div>
              <span
                className={`mt-3 text-sm md:text-base text-center transition-all duration-300 ${
                  activeCategory === category._id
                    ? "text-pink-700 font-medium"
                    : "text-gray-600"
                }`}
              >
                {category.name}
              </span>

              {activeCategory === category._id && (
                <div className="absolute -bottom-1 left-0 right-0 w-10 mx-auto h-0.5 bg-pink-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg p-2 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-pink-700" />
        </button>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent my-6"></div>

      {loading ? (
        <div className="flex justify-center items-center " id="loader">
          <ClipLoader size={60} />
        </div>
      ) : (
        <>
          <div className="grid font-Outfit grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8 mb-9">
            {filteredProducts?.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-lg text-gray-500">
                  No products found in this category
                </p>
              </div>
            ) : (
              filteredProducts?.map((product: any) => (
                <div
                  key={product?._id}
                  className=""
                  // onClick={() => openProductSelection(product)}
                >
                  <Cards product={product} />
                </div>
              ))
            )}
          </div>
          {totalCount > 8 && (
            <div className="btn text-center ">
              {activeCategorySlug === "all" ? (
                <Link
                  href={`/shop`}
                  className=" border-b-2 border-black cursor-pointer"
                >
                  Show More
                </Link>
              ) : (
                <Link
                  href={`/shop?category=${activeCategorySlug}`}
                  className=" border-b-2 border-black cursor-pointer"
                >
                  Show More
                </Link>
              )}
            </div>
          )}
        </>
      )}

      {activeProduct && (
        <div
          className="fixed inset-0 font-Outfit flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={closeProductSelection}
        >
          <div className="animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <ProductEach
              product={activeProduct}
              onAddToCart={addToCart}
              onBuyNow={buyNow}
              onClose={closeProductSelection}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
