"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const SuggestionsModal = ({
  isOpen,
  setIsOpen,
  suggestions,
  collections,
  setIsSearchOpen,
}) => {
  const modalRef = useRef(null);
  const router = useRouter();
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isOpen || suggestions?.length === 0) return null;
  // Handler for navigating to the product page with search query
  const handleProductClick = (categorySlug: string) => {
    // const params = new URLSearchParams({ query: productName });
    router.push(`/shop?category=${categorySlug}`);
    setIsOpen(false); // Close the modal after navigation
    setIsSearchOpen(false);
  };
  const handleModal = (productSlug: string) => {
    setIsOpen(false); // Close the modal after navigation
    setIsSearchOpen(false);
    router.push(`/product/${productSlug}`);
  };
  return (
    <div className="fixed inset-0 flex items-start justify-center mt-20 z-50">
      <div
        ref={modalRef}
        className="bg-white w-[90%] max-w-lg shadow-md border border-gray-200 rounded-lg px-4 py-4"
      >
        {suggestions?.length > 0 && (
          <>
            <h6 className="px-4 pb-2 pt-2 font-bold text-gray-500 text-sm border-b border-gray-300">
              PRODUCTS
            </h6>
            <ul className="w-full">
              {Array.isArray(suggestions) &&
                suggestions.map((product, index) => (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    key={index}
                  >
                    <Link
                      href={`/product/${product?.slug}`}
                      onClick={() => handleModal(product?.slug)}
                    >
                      {product?.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </>
        )}

        {collections?.length > 0 && (
          <div>
            <h6 className="px-4 pb-2 pt-4 font-bold text-gray-500 text-sm border-b border-gray-300">
              CATEGORIES
            </h6>
            <ul className="w-full">
              {collections?.map((category: any, index: number) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleProductClick(category?.slug)}
                >
                  {/* <Link
                    href={`/collections/${category?.slug}`}
                    onClick={handleModal}
                  > */}
                  {category?.name}
                  {/* </Link> */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionsModal;
