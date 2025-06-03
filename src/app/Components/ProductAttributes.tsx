"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Attribute {
  _id: string;
  type: { name: string };
  values: { _id: string; short_name: string }[];
}
interface Product {
  _id?: number;
  name?: string;
  category?: string;
  main_image?: string;
  second_main_image?: string;
  special_price?: number;
  price: number;
  badge?: string;
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
  product_type?: string;
  stock_value?: any;
  stock_status?: any;
  maxorder?: boolean;
  minorder?: boolean;
  maxorder_value?: any;
  minorder_value?: any;
  totalStock?: any;
  best_selling?: any;
}

interface ProductAttributesProps {
  product: Product;
  selectedAttributes: any;
  setSelectedAttributes: any;
  matchingVariation: any;
  onAddToCart: (
    product: Product,
    matchingVariation: any,
    uniqueId: any,
    quantity: number,
    buynow: boolean
  ) => void;
  onBuyNow: (
    product: Product,
    matchingVariation: any,
    uniqueId: any,
    quantity: number
  ) => void;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  product,
  onBuyNow,
  onAddToCart,
  selectedAttributes,
  setSelectedAttributes,
  matchingVariation,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const touchStartXRef = useRef(null);
  const touchStartTimeRef = useRef<number | null>(null);

  // Combine all images into a single array
  const allImages = useMemo(() => {
    const mainImage = product?.main_image ? [product?.main_image] : [];
    const secondmainImage = product?.second_main_image
      ? [product?.second_main_image]
      : [];
    const otherImages = product?.other_image || [];
    const variantImages = product?.variants
      ? product?.variants.map((variant: any) => variant?.image).filter(Boolean)
      : [];
    return [...mainImage, ...secondmainImage, ...variantImages, ...otherImages];
  }, [product]);

  useEffect(() => {
    const defaultAttributes: { [key: string]: any } = {};
    let defaultImageIndex = 0;

    product?.attributes.forEach((attribute: any) => {
      if (attribute?.values && attribute?.values?.length > 0) {
        defaultAttributes[attribute?.type?.name.toLowerCase()] =
          attribute?.values[0]?._id;

        // Check if the default variation has an image
        const variation = product?.variants.find((variant: any) =>
          variant?.values?.some(
            (attr: any) => attr?._id === attribute?.values[0]?._id
          )
        );
        if (variation?.image) {
          defaultImageIndex = allImages.indexOf(variation?.image);
        }
      }
    });

    setSelectedAttributes(defaultAttributes);
    setCurrentImageIndex(defaultImageIndex); // Set the default image
  }, [product, allImages]);

  const handleImageClick = (): void => {
    if (isHovering) {
      setZoomLevel((prevZoom) => {
        const newZoom = prevZoom + 0.5;
        return newZoom > 3 ? 1 : newZoom;
      });
    }
  };
  const imageRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handlePrevImage = (): void => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : allImages.length - 1;
      imageRefs.current[newIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      return newIndex;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex < allImages.length - 1 ? prevIndex + 1 : 0;
      imageRefs.current[newIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      return newIndex;
    });
  };

  const handleAttributeClick = (item: any, value: any) => {
    setQuantity(1);
    setSelectedAttributes((prev: any) => {
      const updatedAttributes = {
        ...prev,
        [item?.type?.name.toLowerCase()]: value?._id,
      };

      // Find the variation image that matches all selected attributes
      const matchingVariationImage = product?.variants.find((variant: any) =>
        Object.entries(updatedAttributes).every(([key, selectedValue]) =>
          variant?.values?.some((attr: any) => attr?._id === selectedValue)
        )
      )?.image;

      if (matchingVariationImage) {
        const imageIndex = allImages.indexOf(matchingVariationImage);
        if (imageIndex !== -1) {
          setCurrentImageIndex(imageIndex);
        }
      }

      return updatedAttributes;
    });
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchDiff = touchEndX - touchStartXRef.current;
    const timeDiff =
      touchStartTimeRef.current !== null
        ? Date.now() - touchStartTimeRef.current
        : 0;

    // Check if swipe is significant enough to trigger navigation
    // A good threshold is 50px and less than 300ms for a swipe
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;

    if (Math.abs(touchDiff) > minSwipeDistance && timeDiff < maxSwipeTime) {
      if (touchDiff > 0) {
        // Swipe right - go to previous image
        handlePrevImage();
      } else {
        // Swipe left - go to next image
        handleNextImage();
      }
    }

    touchStartXRef.current = null;
    touchStartTimeRef.current = null;
  };

  //manage the product current price
  const currentPrice = useMemo(() => {
    let price = matchingVariation?.special_price;
    return price * quantity;
  }, [selectedAttributes, matchingVariation, quantity]);

  const oldPrice = useMemo(() => {
    let price = matchingVariation?.price;
    return price * quantity;
  }, [selectedAttributes, matchingVariation, quantity]);

  const [stockstatus, setStockStatus] = useState(false);
  const [stockvalue, setStockValue] = useState(0);
  const [maxStockStatus, setMaxStockStatus] = useState(false);
  const [maxStockValue, setMaxStockValue] = useState(0);
  const [minStockStatus, setMinStockStatus] = useState(false);
  const [minsStockValue, setMinStockValue] = useState(0);
  const [deafultqutantity, setdeafultqutantity] = useState(1);
  const [maxbuyitem, setmaxbuyitem] = useState(1);

  const isOutOfStock = useMemo(() => {
    if (product?.maxorder) {
      setMaxStockStatus(true);
      setMaxStockValue(product?.maxorder_value ? product.maxorder_value : 0);
    }

    if (product?.maxorder == false) {
      setMaxStockStatus(false);
    }
    if (product?.minorder) {
      setMinStockStatus(true);
      const minval = product?.minorder_value ? product.minorder_value : 0;
      setMinStockValue(minval);
      setQuantity(minval);
      setdeafultqutantity(minval);
    }

    if (product?.minorder == false) {
      setMinStockStatus(false);
    }

    let returnstatus = false;
    let stockstatusvalue = false;
    let stockmainvalue = 0;

    if (product?.stockManagement?.stock_management === true) {
      if (
        product?.product_type === "variableproduct" &&
        product?.stockManagement?.stock_management_level === "product_level"
      ) {
        const isStockStatusValid = product?.stock_status === "true";
        setStockStatus(isStockStatusValid);
        setStockValue(product?.stock_value ? product.stock_value : 0);
        stockstatusvalue = isStockStatusValid;
        stockmainvalue = product?.stock_value ? product.stock_value : 0;
      } else {
        const isStockStatusValid =
          matchingVariation?.stock_status === true ||
          matchingVariation?.stock_status === "true";
        setStockStatus(isStockStatusValid);
      
        stockstatusvalue = isStockStatusValid;
        setStockValue(
          matchingVariation?.totalStock &&
            matchingVariation?.totalStock !== null
            ? matchingVariation.totalStock
            : 0
        );
        stockmainvalue =
          matchingVariation?.totalStock &&
          matchingVariation?.totalStock !== null
            ? matchingVariation.totalStock
            : 0;
      }
      if (stockstatusvalue === true) {
        if (stockmainvalue <= 0) {
          returnstatus = true;
        } else {
          returnstatus = false;
        }
      } else {
        returnstatus = true;
      }
    } else {
      returnstatus = false;
    }
    let maxstock = product?.maxorder_value ? product.maxorder_value : 0;

    if (returnstatus === false) {
      if (minsStockValue > stockmainvalue) {
        returnstatus = true;
      }
      if (product?.maxorder === true) {
        if (maxstock < stockmainvalue) {
          setmaxbuyitem(maxstock);
        } else {
          setmaxbuyitem(stockmainvalue);
        }
      } else {
        setmaxbuyitem(stockmainvalue);
      }
    }

    return returnstatus;
  }, [product, matchingVariation]);

  return (
    <>
      <div className="block md:hidden px-2 py-2 ">
        <h2 className="text-xl font-bold text-gray-900 hover:text-pink-600 transition-colors">
          {product?.name}
        </h2>
      </div>
      <div className="w-full md:w-1/2 mb-6 md:mb-0 px-0 md:px-5">
        <div className="relative overflow-hidden bg-gray-50 rounded-2xl p-4 flex items-center justify-center aspect-square">
          <button
            className="absolute left-6 top-1/2 z-50 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setZoomLevel(1);
            }}
            onClick={handleImageClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={allImages[currentImageIndex]}
              alt={product?.name}
              className="transition-transform border-2 duration-300 ease-in-out max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${zoomLevel})`,
                cursor: isHovering ? "zoom-in" : "auto",
              }}
            />
          </div>
          <button
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            onClick={handleNextImage}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="mt-6 w-full md:w-3/4 mx-auto relative">
          <div className="flex space-x-3 overflow-x-auto pb-2 py-3 hide-scrollbar px-10">
            {allImages?.map((img: any, index: any) => (
              <button
                key={index}
                ref={(el) => (imageRefs.current[index] = el)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                  currentImageIndex === index
                    ? "ring-2 ring-pink-500 shadow-lg transform scale-105"
                    : "hover:ring-2 hover:ring-pink-200"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={img}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            onClick={handleNextImage}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="w-full mt-5 md:w-1/2 px-5">
        <div className=" items-start hidden md:flex flex-col-reverse">
          <h1 className="text-2xl font-bold text-gray-900 hover:text-pink-600 transition-colors">
            {product?.name}
          </h1>

          {product?.badge ||
            (product?.best_selling && (
              <span className=" bg-gradient-to-r from-pink-500 to-purple-500 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {product?.badge ?? "Best Selling"}
              </span>
            ))}
        </div>

        <div className="mt-0 md:mt-4 mb-4 space-y-6 bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Availability</p>
              <p
                className={`font-medium ${
                  isOutOfStock ? "text-red-600" : "text-green-600"
                }`}
              >
                {isOutOfStock ? "Out of stock" : "In stock"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Model Name</p>
              <p className="font-medium text-gray-900">
                {product?.model_no || "N/A"}
              </p>
            </div>
            {/* Discount Badge */}
          </div>
        </div>

        {product?.attributes.map((item: any) => (
          <div className="space-y-3 mb-6" key={item?._id}>
            <div className="text-sm font-semibold text-gray-900 capitalize">
              {item?.type?.name}:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {item?.values?.map((value: any) => (
                <button
                  key={value?._id}
                  onClick={() => handleAttributeClick(item, value)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedAttributes[item?.type?.name.toLowerCase()] ===
                    value?._id
                      ? "bg-pink-100 text-pink-700 ring-2 ring-pink-500"
                      : "bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {["colour", "colours", "color", "colors"].includes(
                      item?.type?.name.toLowerCase()
                    ) ? (
                      <div
                        className="w-6 h-6 rounded-full shadow-inner capitalize"
                        style={{ backgroundColor: value?.short_name }}
                      />
                    ) : null}
                    <span className=" capitalize">
                      {(value?.short_name).toLowerCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <div className="bg-gray-50 p-6 flex items-center justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                ₹{currentPrice?.toFixed(2)}
              </p>
              {oldPrice && (
                <p className="text-sm text-gray-500 line-through mt-1">
                  ₹{oldPrice.toFixed(2)}
                </p>
              )}
            </div>
            {!isOutOfStock && (
              <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm">
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      product?.stockManagement?.stock_management === true ||
                      product?.minorder == true
                        ? Math.max(deafultqutantity, q - 1)
                        : Math.max(1, q - 1)
                    )
                  }
                  className={`w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors ${
                    product?.stockManagement?.stock_management === true &&
                    quantity === (deafultqutantity ?? 1)
                      ? " text-gray-400"
                      : " hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  -
                </button>
                <span className="w-8 text-center font-medium text-black">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      product?.stockManagement?.stock_management === true ||
                      product?.maxorder == true
                        ? Math.min(maxbuyitem, q + 1)
                        : q + 1
                    )
                  }
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    product?.stockManagement?.stock_management === true &&
                    quantity === maxbuyitem
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  +
                </button>
              </div>
            )}
          </div>

          {isOutOfStock ? (
            <div className="p-6 text-center">
              <p className="text-xl font-medium text-red-600">Out of stock</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <button
                onClick={() => {
                  onAddToCart(product, matchingVariation, quantity, false);
                  toast.success("Successfully Added");
                }}
                className="w-full py-3 px-6 bg-white text-gray-900 rounded-lg border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-200 font-medium"
              >
                Add to Cart
              </button>
              <button
                onClick={() => onBuyNow(product, matchingVariation, quantity)}
                className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductAttributes;
