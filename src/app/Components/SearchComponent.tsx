import { useEffect, useRef } from "react";
import gsap from "gsap";
import SuggestionsModal from "./SuggestionModal";

interface SearchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  handleSearchChange: any;
  setIsModalOpen: any;
  isModalOpen: any;
  suggestions: any;
  collections: any;
}

const SearchComponent: React.FC<SearchProps> = ({
  isSearchOpen,
  setIsSearchOpen,
  handleSearchChange,
  isModalOpen,
  setIsModalOpen,
  suggestions,
  collections,
}) => {
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Animate Search UI
  useEffect(() => {
    if (isSearchOpen && searchBarRef.current) {
      gsap.to(searchBarRef.current, {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: "power2.out",
        onComplete: () => {
          searchInputRef.current?.focus();
        },
      });
    } else if (searchBarRef.current) {
      gsap.to(searchBarRef.current, {
        duration: 0.5,
        opacity: 0,
        y: -20,
        ease: "power2.in",
      });
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <div
      ref={searchBarRef}
      className={`${
        isSearchOpen ? "absolute" : "hidden"
      } left-0 right-0 bg-white text-black shadow-md p-4 z-50 opacity-0 -translate-y-4`}
    >
      <div className="max-w-3xl mx-auto flex items-center">
        <div className="w-full md:w-2/3 mx-auto">
          <input
            ref={searchInputRef}
            className="w-full peer z-[21] px-6 py-4 rounded-xl outline-none duration-200 ring-2 ring-pink-200 focus:ring-pink-500"
            placeholder="Search..."
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {/* Suggestions Modal */}
      <SuggestionsModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        suggestions={suggestions?.productsdata}
        collections={collections}
        setIsSearchOpen={setIsSearchOpen}
      />
    </div>
  );
};

export default SearchComponent;
