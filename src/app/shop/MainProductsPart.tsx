"use client";
import { Cross, SlidersHorizontal, X, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Availability from "./Availability";
import PriceRangeSlider from "./PriceRangeSlider";
import { CartItem, Product } from "./Shop";
import { useAppDispatch } from "../../lib/hooks";
import { useSearchParams } from "next/navigation";
import { fetchShopProductsData } from "../../lib/AllSlices/productsSlice";
import { addItems } from "../../lib/AllSlices/cartSlice";
import FilterTypes from "./FilterTypes";
import Image from "next/image";
import Cards from "../Components/Cards";
import ProductEach from "../Components/ProductEach";
import Paging from "./Paging";
import SaleStatus from "./SaleStatus";
import BestSelling from "./BestSelling";
import { useRouter } from "next/navigation";

export default function MainProductsPart({
  salesCategories,
  productsData,
  pageChange,
  productsStatuCount,
  shopFilterTypes,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [isClient, setIsClient] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesToShow, setCategoriesToShow] =
    useState<any[]>(salesCategories);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const productsRef = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [totalCount, setTotalCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [saleStatus, setSaleStatus] = useState(false);
  const [bestSelling, setBestSelling] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const searchParams = useSearchParams();
  const categoryq = searchParams?.get("category");
  const sale = searchParams?.get("sale");
  const newArrivals = searchParams?.get("new-arrivals");
  const bestselling = searchParams?.get("bestselling");
  const [defaultCatId, setDefaultCatId] = useState();
  // Track if we have active filters
  useEffect(() => {
    setHasActiveFilters(
      selectedCategories.length > 0 ||
        selectedSizes?.length > 0 ||
        selectedColors?.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < Infinity ||
        sortOption !== "newest" ||
        bestSelling ||
        !!sale
    );
  }, [
    selectedCategories,
    selectedSizes,
    selectedColors,
    priceRange,
    sortOption,
    bestSelling,
    sale,
  ]);

  // Initial data load only if no filters are active
  useEffect(() => {
    // if (!categoryq && !hasActiveFilters && productsData?.productsdata) {
    //   setProducts(productsData.productsdata);
    //   setTotalPages(productsData.totalPages);
    //   setTotalCount(productsData?.totalCount);
    // }
  }, [categoryq, hasActiveFilters]);

  const filteredProducts = products;
  const router = useRouter();
  //state to update sales status
  useEffect(() => {
    setSaleStatus(!!sale);
  }, [setSaleStatus, sale]);

  useEffect(() => {
    if (newArrivals === "true") {
      setSortOption("newest");
      setSelectedCategories([]);
      setPriceRange([0, Infinity]);
      setSelectedColors([]);
      setSelectedSizes([]);
    } else if (bestselling === "true") {
      setBestSelling(true);
      setSelectedCategories([]);
      setPriceRange([0, Infinity]);
      setSelectedColors([]);
      setSelectedSizes([]);
    } else if (sale === "true") {
      setSelectedCategories([]);
      setPriceRange([0, Infinity]);
      setSelectedColors([]);
      setSelectedSizes([]);
    }
  }, [newArrivals, dispatch, bestselling, sale]);

  useEffect(() => {
    if (categoryq && categoryq !== "all") {
      let matchedCategory = salesCategories.find(
        (cat: any) => cat?.slug === categoryq
      );
      if (!matchedCategory) {
        // Search in subCategories if no match is found in salesCategories
        salesCategories.forEach((cat: any) => {
          if (cat.subCategories) {
            const subCategoryMatch = cat.subCategories.find(
              (subCat: any) => subCat?.slug === categoryq
            );
            if (subCategoryMatch) {
              matchedCategory = subCategoryMatch; // Store the subcategory
              setCategoriesToShow([
                subCategoryMatch,
                ...(subCategoryMatch.subCategories || []),
              ]); // Show subcategory and its subcategories
            }
          }
        });
      } else {
        setCategoriesToShow([
          matchedCategory,
          ...(matchedCategory.subCategories || []),
        ]); // Show parent and subcategories
      }

      if (matchedCategory) {
        setSelectedCategories([matchedCategory._id]);
      }
    } else {
      setCategoriesToShow(salesCategories); // Reset to all categories
    }
  }, [categoryq, salesCategories]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(categoryId);
      let updated = isAlreadySelected
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId];

      // If a subcategory is selected, remove its parent
      if (!isAlreadySelected) {
        salesCategories.forEach((parent) => {
          const subCatIds =
            parent.subCategories?.map((sub: any) => sub._id) || [];
          if (subCatIds.includes(categoryId)) {
            updated = updated.filter((id) => id !== parent._id);
          }
        });
      }

      return updated;
    });
  };

  useEffect(() => {
    if (categoryq && categoryq !== "all") {
      let matchedCategory = salesCategories.find(
        (cat: any) => cat?.slug === categoryq
      );

      if (!matchedCategory) {
        // Search in subCategories if no match is found in salesCategories
        salesCategories.forEach((cat: any) => {
          if (cat.subCategories) {
            const subCategoryMatch = cat.subCategories.find(
              (subCat: any) => subCat?.slug === categoryq
            );
            if (subCategoryMatch) {
              matchedCategory = subCategoryMatch;
              setCategoriesToShow([
                subCategoryMatch,
                ...(subCategoryMatch.subCategories || []),
              ]);
            }
          }
        });
      } else {
        setCategoriesToShow([
          matchedCategory,
          ...(matchedCategory.subCategories || []),
        ]);
      }

      // Set the category ID
      if (matchedCategory) {
        setDefaultCatId(matchedCategory._id);
        setSelectedCategories([matchedCategory._id]); // Set the category ID as selected
      }
    } else {
      setDefaultCatId(null); // Reset categoryId
      setCategoriesToShow(salesCategories); // Show all categories
    }
  }, [categoryq, salesCategories]);

  useEffect(() => {
    if (selectedCategories?.length <= 0 && defaultCatId) {
      setSelectedCategories([defaultCatId]);
    }
    if (selectedCategories?.length > 1) {
      if (selectedCategories?.includes(defaultCatId || "")) {
        // Remove the defaultCatId from the selectedCategories array
        setSelectedCategories(
          selectedCategories?.filter((cat) => cat !== defaultCatId)
        );
      }
    }
  }, [selectedCategories, defaultCatId]);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);


useEffect(() => {
  // const hasFiltersOrQueries =
  //  selectedCategories.length > 0||
  // selectedSizes?.length > 0||
  // selectedColors?.length > 0||
  // !(priceRange[0] === 0 && priceRange[1] === Infinity)||
  // !!sortOption||
  // bestSelling === true||
  // !!categoryq||
  // !!sale||
  // !!newArrivals||
  // !!bestselling

  // if (!hasFiltersOrQueries) {
  //   // No filters active, show initial data
  //   setProducts(productsData.productsdata);
  //   setTotalPages(productsData.totalPages);
  //   setTotalCount(productsData.totalCount);
  //   return; // 🚫 Stop further execution
  // }
// console.log('hasFiltersOrQueries',hasFiltersOrQueries)
  // ✅ Filters are active - fetch filtered data
  setIsLoading(true);
  setCurrentPage(1);
  setPage(1);

  dispatch(
    fetchShopProductsData({
      selectedCategories,
      limit: 24,
      page: 1,
      selectedSizes,
      selectedColors,
      priceRange,
      sortOption,
      bestSelling,
      sale:saleStatus,
    })
  ).then((response) => {
    console.log("response of fetch products is", response?.payload);
    const data = response.payload;
    if (data.success) {
      setProducts(data.productsdata);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    }
    setIsLoading(false);
  });
}, [
  selectedCategories,
  selectedSizes,
  selectedColors,
  priceRange,
  sortOption,
  bestSelling,
  categoryq,
  sale,
  newArrivals,
  bestselling,
  saleStatus,
]);


  const openProductSelection = (product: Product): void => {
    router.push(`/product/${product?.slug}`);
    // setActiveProduct(product);
  };

  const closeProductSelection = (): void => {
    setActiveProduct(null);
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

  //handle buy now
  const buyNow = (
    product: Product,
    matchingVariation: any,
    quantity: number,
    uniqueId: any
  ): void => {
    addToCart(product, matchingVariation, quantity, {}, true);
  };
  console.log("");
  const handlePageChange = async (newPage: number) => {
    try {
      setIsLoading(true);
      setCurrentPage(newPage);
      setPage(newPage);

      // if (
      //   selectedCategories.length > 0 ||
      //   selectedSizes?.length > 0 ||
      //   selectedColors?.length > 0 ||
      //   priceRange?.length > 0 ||
      //   sortOption ||
      //   bestSelling
      // ) {
        const response = await dispatch(
          fetchShopProductsData({
            
            selectedCategories,
            limit: 24,
            page: newPage,
            selectedSizes,
            selectedColors,
            priceRange,
            sortOption,
            bestSelling,
            sale:saleStatus
          })
      ).unwrap();
      console.log('respone 2 of second api')
        setProducts(response.productsdata);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      // } else {
      //   const newProductsData = await pageChange(newPage);
      //   setProducts(newProductsData.productsdata);
      //   setTotalPages(newProductsData.totalPages);
      //   setTotalCount(newProductsData.totalCount);
      // }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  //to captalize the word
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };
  // Loading Skeleton component
  const ProductLoadingSkeleton = () => (
    <>
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md animate-pulse"
        >
          <div className="h-48 bg-gray-300 rounded-t-lg"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </>
  );
  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between relative  max-w-7xl mx-auto">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static left-0  top-0 h-full lg:h-auto z-50 md:z-30 bg-white lg:bg-gray-50 overflow-y-auto lg:overflow-visible  w-72  lg:p-4 shadow-lg lg:shadow-none`}
        >
          {/* Sidebar content */}
          <div className=" relative text-left mb-20 w-full lg:w-full ">
            {/* Close button for mobile view */}
            <button className=" absolute top-4 right-4  lg:hidden z-50">
              <p
                // size={24}
                className="lg:hidden p-2"
                onClick={toggleSidebar}
              >
                {" "}
                <XIcon />
              </p>
            </button>
            {/* Categories - Fixed at the top */}
            {/* Scrollable content */}

            <div className="w-full  space-y-2 overflow-y-auto p-4">
              {categoriesToShow?.length > 1 && (
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Categories
                </h2>
              )}

              {categoriesToShow?.map((cat: any) => (
                <>
                  {cat?._id != defaultCatId && (
                    <div
                      key={cat?._id}
                      className="flex items-center justify-between  text-sm "
                    >
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-pink-600"
                          checked={selectedCategories.includes(cat?._id)}
                          onChange={() => handleCategoryChange(cat?._id)}
                        />
                        <span className="ml-2 text-gray-700">
                          {capitalizeWords(cat?.name || "")}
                        </span>
                      </label>
                    </div>
                  )}
                </>
              ))}
              {categoriesToShow?.length > 1 && (
                <hr className="mt-5 w-full border-t-2" />
              )}

              {/* Availability */}
              <Availability productsStatuCount={productsStatuCount} />
              <SaleStatus
                salestatus={saleStatus}
                setSaleStatus={setSaleStatus}
              />
              <BestSelling
                bestSelling={bestSelling}
                setBestSelling={setBestSelling}
              />
              <hr className="mt-5 w-full border-t-2" />

              {/* Price Range */}
              <PriceRangeSlider
                setPriceRange={setPriceRange}
                priceRange={priceRange}
              />

              <hr className="mt-5 w-full border-t-2" />

              {/* types like color , size */}
              <FilterTypes
                shopFilterTypes={shopFilterTypes}
                selectedColors={selectedColors}
                setSelectedSizes={setSelectedSizes}
                selectedSizes={selectedSizes}
                setSelectedColors={setSelectedColors}
              />

              {/* Promo banner */}
              {/* <div className="h-72 w-full rounded-lg overflow-hidden relative shadow-md">
                <Image
                  src="/lunch.png"
                  layout="fill"
                  objectFit="cover"
                  alt="Lunch Box"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Lunch Box
                  </h2>
                  <button className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700 transition-colors duration-200">
                    Shop Now
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4 lg:mt-0">
          <div className="flex flex-col md:flex-row justify-between px-2">
            {/* Feature product heading with toggle button */}
            <div className="flex w-full justify-between items-center  mt-6 md:mb-0">
              <div>
                <p className="text-sm md:text-md text-gray-700">
                  {isLoading ? (
                    "Loading products..."
                  ) : totalCount > 0 ? (
                    <>
                      Showing {startIndex} to {endIndex} of {totalCount}{" "}
                      products
                    </>
                  ) : (
                    "No entries found"
                  )}
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center items-end gap-1 md:gap-5 w-5/12 md:w-auto  ">
                <div className="flex flex-col gap-1">
                  <p className="text-pink-800 text-xs md:text-md">Sort by:</p>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full md:w-auto bg-white border border-gray-300 rounded-md px-2 py-1 text-xs md:text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="a_to_z">A to Z</option>
                    <option value="z_to_a">Z to A</option>
                    <option value="lowtohigh">Price low to high</option>
                    <option value="hightolow">Price high to low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sort options */}
            <div
              className=" h-10 w-10 rounded-full bg-gray-200 z-30 flex items-center justify-center border-2 lg:hidden fixed left-3 top-64"
              style={{ bottom: "5.5rem" }}
            >
              <button className="text-black " onClick={toggleSidebar}>
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Products grid */}
          <div
            ref={productsRef}
            className="grid font-Outfit grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 p-2 sm:p-4 mt-4 mb-8 md:mb-16"
          >
            {isLoading ? (
              <ProductLoadingSkeleton />
            ) : (
              filteredProducts?.map((product: any) => (
                <div
                  key={product?._id}
                  className="cursor-pointer hover:scale-105 transition-transform duration-300"
                  // onClick={() => openProductSelection(product)}
                >
                  <Cards product={product} />
                </div>
              ))
            )}

            {activeProduct && (
              <div
                className="fixed inset-0 font-Outfit flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
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
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Page changer */}
      <Paging
        currentPage={currentPage}
        totalPage={totalPages}
        isLoading={isLoading}
        onPageChange={(pageNumber) => handlePageChange(pageNumber)}
        pageNeighbours={2}
      />
    </>
  );
}
