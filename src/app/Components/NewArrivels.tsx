// "use client";

// import React, { useState, useRef, useContext, useEffect } from "react";
// import Image from "next/image";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import ProductEach from "./ProductEach";
// import { gsap } from "gsap";
// import { useDispatch } from "react-redux";
// import { addItems } from "../../lib/AllSlices/cartSlice";
// import Cards from "./Cards";

// interface Color {
//   name: string;
//   colorCode: string;
//   priceMultiplier: number;
//   outlinecolor: string;
// }

// interface Product {
//   _id?: number;
//   name?: string;
//   category?: string;
//   main_image?: string;
//   special_price?: number;
//   price: number;
//   badge?: string;
//   colors?: Color[];
//   sizes?: string[];
//   variations?: string[];
//   other_image?: string[];
//   brand_name?: any;
//   variants?: any;
//   categories?: any;
//   productype?: any;
//   productsdata?: any;
// }

// interface CartItem extends Product {
//   selectedColor: Color;
//   selectedSize: string;
//   quantity: number;
//   uniqueId: number;
// }

// const NewArrivals: React.FC<{
//   newArrivels: Product[];
//   newArrivelstitle: any;
// }> = ({ newArrivels, newArrivelstitle }) => {
//   const [activeProduct, setActiveProduct] = useState<Product | null>(null);
//   const [showCart, setShowCart] = useState<boolean>(false);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [cardsPerView, setCardsPerView] = useState<number>(4);
//   const cardsContainerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const updateCardsPerView = (): void => {
//       const width = window.innerWidth;
//       if (width < 640) setCardsPerView(2);
//       else if (width < 768) setCardsPerView(2);
//       else if (width < 1024) setCardsPerView(3);
//       else setCardsPerView(4);
//     };

//     updateCardsPerView();
//     window.addEventListener("resize", updateCardsPerView);
//     return () => window.removeEventListener("resize", updateCardsPerView);
//   }, []);

//   const maxIndex = Math.max(
//     0,
//     newArrivels?.productsdata?.length - cardsPerView
//   );
//   const dispatch = useDispatch();

//   const addToCart = (
//     product: Product,
//     matchingVariation: any,
//     quantity: number,
//     selectedAttributes: any,
//     buyNow?: boolean
//   ): void => {
//     const newItem: CartItem = {
//       ...product,
//       matchingVariation,
//       quantity: quantity,
//       buyNow: buyNow || false,
//       uniqueId: Date.now(),
//     };
//     dispatch(addItems(newItem));
//     closeProductSelection();
//   };

//   const buyNow = (
//     product: Product,
//     matchingVariation: any,
//     quantity: number,
//     uniqueId: any
//   ): void => {
//     addToCart(product, matchingVariation, quantity, {}, true);
//   };

//   const animateSlide = (direction: "left" | "right"): void => {
//     const container = cardsContainerRef.current;
//     if (!container) return;

//     const cardWidth = container.offsetWidth / cardsPerView;

//     gsap.fromTo(
//       container,
//       {
//         x: direction === "left" ? 0 : -cardWidth,
//         opacity: 0.5,
//       },
//       {
//         x: 0,
//         opacity: 1,
//         duration: 0.4,
//         ease: "power2.out",
//       }
//     );
//   };

//   const handlePrev = (): void => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//       animateSlide("right");
//     }
//   };

//   const handleNext = (): void => {
//     if (currentIndex < maxIndex) {
//       setCurrentIndex((prev) => prev + 1);
//       animateSlide("left");
//     }
//   };

//   const openProductSelection = (product: Product): void => {
//     setActiveProduct(product);
//   };

//   const closeProductSelection = (): void => {
//     setActiveProduct(null);
//   };

//   const visibleProducts = newArrivels?.productsdata?.slice(
//     currentIndex,
//     currentIndex + cardsPerView
//   );

//   return (
//     <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-12 font-Outfit text-black ">
//       <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-Cinzel text-center">
//         {newArrivelstitle?.title}
//       </h2>
//       <div
//         className="font-Outfit font-medium text-lg text-center mb-5 text-black"
//         dangerouslySetInnerHTML={{
//           __html: newArrivelstitle?.description || "",
//         }}
//       />

//       <div className="relative mt-6 ">
//         <button
//           onClick={handlePrev}
//           className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//           disabled={currentIndex === 0}
//         >
//           <ChevronLeft className="w-6 h-6" />
//         </button>

//         <div className="overflow-hidden">
//           <div
//             ref={cardsContainerRef}
//             className="grid gap-6 py-5 mx-2"
//             style={{
//               gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
//             }}
//           >
//             {visibleProducts.map((product: any) => (
//               <div
//                 key={product?._id}
//                 className=" "
//                 onClick={() => openProductSelection(product)}
//               >
//                 <Cards product={product} />
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={handleNext}
//           className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//           disabled={currentIndex >= maxIndex}
//         >
//           <ChevronRight className="w-6 h-6" />
//         </button>
//       </div>

//       {activeProduct && (
//         <div
//           className="fixed inset-0 font-Outfit flex items-center justify-center bg-black bg-opacity-50 z-50"
//           onClick={closeProductSelection}
//         >
//           <ProductEach
//             product={activeProduct}
//             onAddToCart={addToCart}
//             onBuyNow={buyNow}
//             onClose={closeProductSelection}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewArrivals;
"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductEach from "./ProductEach";
import { useDispatch } from "react-redux";
import { addItems } from "../../lib/AllSlices/cartSlice";
import Cards from "./Cards";
import { useRouter } from "next/navigation";
import { Product } from "../shop/Shop";

interface Color {
  name: string;
  colorCode: string;
  priceMultiplier: number;
  outlinecolor: string;
}

interface CartItem extends Product {
  selectedColor: Color;
  selectedSize: string;
  quantity: number;
  uniqueId: number;
}

const NewArrivals: React.FC<{
  newArrivels: Product[];
  newArrivelstitle: any;
}> = ({ newArrivels, newArrivelstitle }) => {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardsPerView, setCardsPerView] = useState<number>(4);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  // Track touch positions and state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const updateCardsPerView = (): void => {
      const width = window.innerWidth;
      if (width < 640) setCardsPerView(2);
      else if (width < 768) setCardsPerView(2);
      else if (width < 1024) setCardsPerView(3);
      else setCardsPerView(4);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(
    0,
    newArrivels?.productsdata?.length - cardsPerView
  );
  const dispatch = useDispatch();

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

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = (): void => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const openProductSelection = (product: Product): void => {
    if (!isDragging) {
      router.push(`/product/${product?.slug}`);
      // setActiveProduct(product);
    }
  };

  const closeProductSelection = (): void => {
    setActiveProduct(null);
  };

  const visibleProducts = newArrivels?.productsdata?.slice(
    currentIndex,
    currentIndex + cardsPerView
  );

  return (
    <>
      {visibleProducts?.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-12 font-Outfit text-black ">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-Cinzel text-center">
            {newArrivelstitle?.title}
          </h2>
          <div
            className="font-Outfit font-medium text-lg text-center mb-5 text-black"
            dangerouslySetInnerHTML={{
              __html: newArrivelstitle?.description || "",
            }}
          />

          <div className="relative mt-6 ">
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              className="overflow-hidden"
              onTouchStart={(e) => {
                setTouchStart(e.targetTouches[0].clientX);
                setIsDragging(false);
              }}
              onTouchMove={(e) => {
                setTouchEnd(e.targetTouches[0].clientX);
                setIsDragging(true);
              }}
              onTouchEnd={() => {
                if (touchStart && touchEnd) {
                  const distance = touchStart - touchEnd;
                  if (Math.abs(distance) > 50) {
                    distance > 0 ? handleNext() : handlePrev();
                  }
                }
                setTouchStart(null);
                setTouchEnd(null);
                setTimeout(() => setIsDragging(false), 100);
              }}
              onMouseDown={(e) => {
                setTouchStart(e.clientX);
                setIsDragging(false);
              }}
              onMouseMove={(e) => {
                if (touchStart !== null) {
                  setTouchEnd(e.clientX);
                  setIsDragging(true);
                }
              }}
              onMouseUp={() => {
                if (touchStart && touchEnd) {
                  const distance = touchStart - touchEnd;
                  if (Math.abs(distance) > 50) {
                    distance > 0 ? handleNext() : handlePrev();
                  }
                }
                setTouchStart(null);
                setTouchEnd(null);
                setTimeout(() => setIsDragging(false), 100);
              }}
              onMouseLeave={() => {
                setTouchStart(null);
                setTouchEnd(null);
                setIsDragging(false);
              }}
            >
              <div
                ref={cardsContainerRef}
                className="grid gap-6 py-5 mx-2 transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
                  cursor: touchStart !== null ? "grabbing" : "grab",
                }}
              >
                {visibleProducts?.map((product: any) => (
                  <div
                    key={product?._id}
                    className=""
                    // onClick={() => openProductSelection(product)}
                  >
                    <Cards product={product} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {activeProduct && (
            <div
              className="fixed inset-0 font-Outfit flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={closeProductSelection}
            >
              <ProductEach
                product={activeProduct}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
                onClose={closeProductSelection}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NewArrivals;
