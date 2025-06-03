"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChevronRight, ChevronDown, Menu, X, ChevronLeft } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { fetchProductsData } from "../../../lib/AllSlices/productsSlice";
import { useAppDispatch } from "../../../lib/hooks";
import Cards from "../../Components/Cards";
import { usePathname } from "next/navigation";

export interface Product {
  _id?: number;
  name?: string;
  category?: string;
  main_image?: string;
  special_price?: number;
  price: number;
  badge?: string;
  //   colors?: Color[];
  sizes?: string[];
  variations?: string[];
  other_image?: string[];
  brand_name?: any;
  variants?: any;
  categories?: any;
  productype?: any;
}

interface RootState {
  productsdata: {
    productsState: {
      data: any;
      loading: boolean;
      error: string | null;
    };
  };
}
const Page: React.FC = () => {
  const { data: products } = useSelector(
    (state: RootState) => state.productsdata.productsState
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    products && products.length > 0
      ? Math.max(...products.map((p: any) => p.price))
      : 0,
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("best selling");
  const productsRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useAppDispatch();
  const currenturl = usePathname();
  const categoryslug = currenturl?.replace("/collections/", "");
  setSearchQuery(categoryslug);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    dispatch(fetchProductsData({ search: searchQuery }));
  }, [dispatch]);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAvailabilityChange = (option: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedAvailability([]);
    setPriceRange([0, Math.max(...products?.map((p: any) => p.price))]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };
  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (product: any) =>
          (selectedCategories.length === 0 ||
            selectedCategories.includes(
              product.categories.map((e: any) => e?._id)
            )) &&
          (selectedAvailability.length === 0 ||
            (selectedAvailability.includes("In stock") && product.price > 0) ||
            (selectedAvailability.includes("Out of stock") &&
              product.price === 0)) &&
          //   product.price >= priceRange[0] &&
          //   product.price <= priceRange[1] &&
          (selectedColors.length === 0 ||
            selectedColors.some((color) => product.colors.includes(color))) &&
          (selectedSizes.length === 0 ||
            selectedSizes.some((size) => product.sizes.includes(size)))
      )
    : [];
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price low to high":
        return a.price - b.price;
      case "price high to low":
        return b.price - a.price;
      case "newest":
        return b.id - a.id;
      default: // "best selling"
        return 0; // Assuming we don't have a specific metric for best selling
    }
  });

  const productsPerPage = 20;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (!isClient) {
    return null; // or a loading spinner
  }

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
            <Link href="#">Shop Now</Link>
          </div>
        </div>
      </div>

      {/* Promotional images */}
      {/* <div className="flex flex-col sm:flex-row justify-evenly gap-4 px-4 sm:px-8 mb-8 container mx-auto">
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
      </div> */}

      {/* Main content */}
      <div className="flex flex-col lg:flex-row justify-between relative  max-w-7xl mx-auto">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static left-0  top-0 h-full lg:h-auto z-40 bg-white lg:bg-gray-50 overflow-y-auto lg:overflow-visible  w-72  lg:p-4 shadow-lg lg:shadow-none`}
        >
          {/* Sidebar content */}
          <div className="text-left mb-20 w-full lg:w-full ">
            {/* Categories - Fixed at the top */}
            <div className="sticky top-0  bg-white lg:bg-gray-50 h-20 z-20   flex justify-between items-center">
              <h2 className="text-2xl font-semibold p-4 text-gray-800">
                Filter
              </h2>
              <button onClick={toggleSidebar} className="lg:hidden p-4">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="w-full  space-y-2 overflow-y-auto p-4">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Categories
              </h2>

              {Array.from(
                new Set(
                  products && Array.isArray(products)
                    ? products.flatMap((p: any) =>
                        p.categories.map((c: any) => c.name)
                      )
                    : // ? products.flatMap((p: any) => p.categories)
                      []
                )
              ).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-pink-600"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="ml-2 text-gray-700">{category}</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    (
                    {products && Array.isArray(products)
                      ? products.filter((p: any) =>
                          p.categories.includes(category)
                        ).length
                      : 0}
                    )
                  </span>
                </div>
              ))}

              <hr className="mt-5 w-full border-t-2" />

              {/* Filter */}
              <div className="w-full">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  Filter
                </h2>
                <p className="text-lg text-gray-600">
                  {filteredProducts.length} Products
                </p>
              </div>

              <hr className="mt-5 w-full border-t-2" />

              {/* Availability */}
              <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Availability
                </h2>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    {selectedAvailability.length} selected
                  </p>
                  <button
                    className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                    onClick={() => setSelectedAvailability([])}
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-2">
                  {["In stock", "Out of stock"].map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-pink-600"
                          checked={selectedAvailability.includes(option)}
                          onChange={() => handleAvailabilityChange(option)}
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                      <span className="text-sm text-gray-500">(23)</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="mt-5 w-full border-t-2" />

              {/* Price Range */}
              <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Price Range
                </h2>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-600">
                    The highest price is ₹
                    {Math.max(
                      ...(Array.isArray(products)
                        ? products.map((p: any) => p.price)
                        : [0])
                    ).toFixed(2)}
                  </p>
                  <button
                    className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                    onClick={() =>
                      setPriceRange([
                        0,
                        Math.max(
                          ...(Array.isArray(products)
                            ? products.map((p: any) => p.price)
                            : [0])
                        ),
                      ])
                    }
                  >
                    Reset
                  </button>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                  <div
                    className="h-full bg-pink-600 rounded-full"
                    style={{
                      width: `${
                        ((priceRange[1] - priceRange[0]) /
                          Math.max(
                            ...(Array.isArray(products)
                              ? products.map((p: any) => p.price)
                              : [0])
                          )) *
                        100
                      }%`,
                      marginLeft: `${
                        (priceRange[0] /
                          Math.max(
                            ...(Array.isArray(products)
                              ? products.map((p: any) => p.price)
                              : [0])
                          )) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <label
                      htmlFor="min-price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      From
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                        ₹
                      </span>
                      <input
                        type="number"
                        id="min-price"
                        className="form-input pl-7 w-24 rounded-md border-gray-300"
                        placeholder="0"
                        value={priceRange[0]}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            Number(e.target.value),
                            priceRange[1]
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="max-price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      To
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                        ₹
                      </span>
                      <input
                        type="number"
                        id="max-price"
                        className="form-input pl-7 w-24 rounded-md border-gray-300"
                        placeholder="589"
                        value={priceRange[1]}
                        onChange={(e) =>
                          handlePriceRangeChange(
                            priceRange[0],
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="mt-5 w-full border-t-2" />

              {/* Color */}
              <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Color
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pink",
                    "red",
                    "yellow",
                    "green",
                    "black",
                    "blue",
                    "purple",
                    "gray",
                  ].map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full bg-${color}-500 border-2 ${
                        selectedColors.includes(color)
                          ? "border-gray-400"
                          : "border-gray-200"
                      } hover:border-gray-400 transition-colors duration-200`}
                      onClick={() => handleColorSelect(color)}
                    ></button>
                  ))}
                </div>
              </div>

              <hr className="mt-5 w-full border-t-2" />

              {/* Size */}
              <div className="w-full">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Size
                </h2>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    {selectedSizes.length} selected
                  </p>
                  <button
                    className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                    onClick={() => setSelectedSizes([])}
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-2">
                  {["100ml", "250ml", "500ml", "750ml"].map((size, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-pink-600"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeSelect(size)}
                        />
                        <span className="ml-2 text-gray-700">{size}</span>
                      </label>
                      <span className="text-sm text-gray-500">(23)</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="mt-5 w-full border-t-2" />

              {/* Promo banner */}
              <div className="h-72 w-full rounded-lg overflow-hidden relative shadow-md">
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
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4  lg:mt-0">
          {/* Feature product heading with toggle button */}
          <div className="flex h-20 bg-white sticky top-0 z-20 justify-between items-center mb-5">
            <button className="lg:hidden text-black " onClick={toggleSidebar}>
              {isSidebarOpen ? (
                <X size={24} />
              ) : (
                <SlidersHorizontal size={24} />
              )}
            </button>
            <h1 className="font-medium text-2xl">
              Feature product({filteredProducts.length})
            </h1>
          </div>

          {/* Banners */}
          <div className="flex px-4 flex-col mx-auto md:flex-row mb-5">
            {/* ... (banner content) */}
          </div>

          {/* Sort options */}
          <div className="flex justify-end items-center gap-5 mt-5">
            <p className="text-pink-800">Sort by:</p>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="best selling">best selling</option>
              <option value="price low to high">price low to high</option>
              <option value="price high to low">price high to low</option>
              <option value="newest">newest</option>
            </select>
            {/* <ChevronDown /> */}
          </div>

          {/* Products grid */}
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              ref={productsRef}
              className="grid font-Outfit grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 p-4 mt-12 mb-16"
            >
              <div className="group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-lg">
                <Cards product={product} />
              </div>
            </div>
          ))}
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
      <div className="flex justify-center items-center space-x-4 mt-8 mb-8">
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-lg font-semibold">{currentPage}</span>
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
