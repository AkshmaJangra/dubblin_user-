"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  Trash2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { gsap } from "gsap";
import React from "react";
import { useSelector } from "react-redux";
import {
  removeItems,
  increaseQuantity,
  decreaseQuantity,
  CartItem,
} from "../../lib/AllSlices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { fetchSettings } from "../../lib/AllSlices/settingsSlice";
import { fetchProductsData } from "../../lib/AllSlices/productsSlice";
import {
  fetchCategoriesData,
  fetchCategoriesTreeData,
} from "../../lib/AllSlices/catrgoriesSlice";
import SearchComponent from "./SearchComponent";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchCartItemsData } from "../../lib/AllSlices/getCartItemsSlice";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface Link {
  title: string;
  href: string;
}

interface Section {
  title?: string;
  href?: string;
  links: Link[];
}

interface NavigationItem {
  title: string;
  href: string;
  sections: Section[];
}

interface RootState {
  cart: {
    items: CartItem[];
  };
  productsdata: {
    productsState: {
      data: any;
      loading: boolean;
      error: string | null;
    };
  };
  categoriesdata: {
    categoriesState: {
      data: any;
      loading: boolean;
      error: string | null;
    };
    categoriesTreeState: {
      data: any;
      loading: boolean;
      error: string | null;
    };
  };
}

export default function Header(props: any) {
  const { data, userInfo, headerTop } = props;
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const categoryq = searchParams?.get("category");
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
 const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL
  useEffect(() => {
    if (path === "/checkout") {
      setLoading(false);
    }
    setActiveMegaMenu(null);
    setActiveItem(null);
    setIsMobileMenuOpen(false);
    setActiveMobileDropdown(null);

    // If search is open, close it when navigating
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  }, [path, categoryq]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShow(false);
      } else {
        // Scrolling up
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
 const handlelogout = async () => {
    try {
      // Sign out using NextAuth - this will clear the session and cookies
      await signOut({
        redirect: false,
      });

      // After successful logout, redirect to home page
      // router.push("/");
      toast.success("Log out successfully");
      // Force a page refresh to clear any cached states
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  // useEffect(() => {
  //   if (userInfo) {
      
  //     handleClientSignOut()
  //   }
  // },[])
  const { data: suggestions } = useSelector(
    (state: RootState) => state.productsdata.productsState
  );
  const { data: collections } = useSelector(
    (state: RootState) => state.categoriesdata.categoriesState
  );
  const {
    categoriesTreeState: { data: categoriesTree },
  } = useSelector((state: RootState) => state.categoriesdata);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<
    string | null
  >(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showCart, setShowCart] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const settings = useAppSelector((state) => state.settings);
  const [logo, setLogo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setActiveMobileDropdown(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    if (showCart) {
      dispatch(fetchCartItemsData({ items: cart })).then((response) => {
        const data = response.payload;
        if (data.success) {
          setCartItems(data.itemdata);
        }
      });
    }
  }, [showCart, cart]);

  useEffect(() => {
    fetchSettingsData();
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    if (searchText) {
      dispatch(fetchProductsData({ search: searchText, limit: 4 }));
      dispatch(fetchCategoriesData({ search: searchText, limit: 4 }));
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };
  const show_in_menu = true;
  useEffect(() => {
    dispatch(fetchCategoriesTreeData({ show_in_menu }));
  }, []);
  const fetchSettingsData = async () => {
    const data = await dispatch(fetchSettings());
  };

  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCart]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActiveMegaMenu(null); // Close the open menu
        setActiveItem(null); // Reset active item
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showCart &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        // setShowCart(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCart]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveMobileDropdown(null);
  };

  const toggleMobileDropdown = (title: string) => {
    setActiveMobileDropdown((prevTitle) =>
      prevTitle === title ? null : title
    );
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMegaMenu = (title: string) => {
    if (activeMegaMenu === title) {
      setActiveMegaMenu(null); // Close the menu if the same item is clicked
      setActiveItem(null); // Reset active item
    } else {
      setActiveMegaMenu(title); // Open the menu
      setActiveItem(title); // Set the active item
    }
  };

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure the component only renders on the client-side
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent SSR mismatch

  const createDynamicNavigation = (config: any[]): NavigationItem[] => {
    return config?.map(({ title, href, sections }) => ({
      title,
      href,
      sections: sections?.map(
        ({
          sectionTitle,
          sectionHref,
          links,
        }: {
          sectionTitle?: string;
          sectionHref?: any;
          links: any[];
        }) => ({
          title: sectionTitle,
          href: sectionHref,
          links: links?.map(({ linkTitle, linkHref }) => ({
            title: linkTitle,
            href: linkHref,
          })),
        })
      ),
    }));
  };
 
  const usernavigationconfig = [
    ...(userInfo?.email
      ? [
          {
            title: "Dashboard",
            href: `${url}/dashboard`,
            sections: [],
          },
          {
            title: "My Account",
            href: "/",
            sections: [
              {
                links: [
                  { linkTitle: "Profile", linkHref: "/personal-info" },
                  { linkTitle: "My Addresses", linkHref: "/address" },
                ],
              },
            ],
          },

          {
            title: "My Orders",
            href:`${url}/order-history`,
            sections: [],
          },
        ]
      : []),
  ];
  const navigationConfig = [
    {
      title: "About us",
      href: `${url}/about-us`,
      sections: [],
    },

    {
      title: "Shop",
      href: "/shop",
      sections: Array.isArray(categoriesTree)
        ? categoriesTree.map((category: any) => ({
            sectionTitle: category?.name,
            sectionHref: `${url}/shop?category=${category?.slug}`,
            links:
              category?.subCategories?.map((sub: any) => ({
                linkTitle: sub?.name,
                linkHref: `${url}/shop?category=${sub?.slug}`,
              })) || [],
          }))
        : [],
    },
    {
      title: "New Arrivals",
      href: `${url}/shop?new-arrivals=true`,
      sections: [],
    },
    {
      title: "Sale",
      href: `${url}/shop?sale=true`,
      sections: [],
    },
  ];
  const navigation = createDynamicNavigation(navigationConfig);

  const renderNavItem = (item: NavigationItem) => {
    const isActive = activeItem === item?.title;
    const linkClasses = `text-sm font-medium ${
      isActive ? "text-black text-xl font-semibold " : "text-gray-700"
    } hover:text-black hover:text-lg hover:scale-105 active:text-gray-900 active:scale-95 transition-all duration-300 ease-in-out transform`;

    if (item?.title === "About us") {
      return (
        <Link
          href={item.href}
          className={linkClasses}
          onClick={() => {
            setActiveItem(item?.title);
            setActiveMegaMenu(null); // Close the open menu section
          }}
        >
          {item?.title}
        </Link>
      );
    } else if (item?.title === "Shop") {
      return (
        <button
          className={`${linkClasses} flex items-center`}
          onClick={() => {
            toggleMegaMenu(item?.title); // Toggle the menu
          }}
        >
          {item?.title}
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      );
    } else {
      return (
        <Link
          href={item.href}
          className={linkClasses}
          onClick={() => {
            setActiveItem(item?.title);
            setActiveMegaMenu(null); // Close the open menu section
          }}
        >
          {item?.title}
        </Link>
      );
    }
  };

  const handleCheckout = () => {
    setLoading(true);
    if (cart?.length > 0) {
      setShowCart(false); // Close the cart
      router.push("/checkout"); // Navigate to the billing page
    }
  };
 
  return (
    
    <div className=" sticky top-0 z-30 lg:z-[70]">
      <header className="  font-Outfit" ref={headerRef}>
        {/* <div
          className={` font-Outfit text-center py-0 bg-black text-white transition-transform duration-300 translate-y-0 text-sm`}
          dangerouslySetInnerHTML={{ __html: headerTop?.heading }}
        ></div> */}
        <nav
          className={`border-b bg-white relative translate-y-0 
           transition-transform duration-300`}
        >
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="hidden lg:flex lg:flex-1 lg:items-center justify-end lg:space-x-10">
                {(userInfo ? navigation.slice(0, 2) : navigation.slice(0, 2)) // About us, Shop
                  .map((item) => (
                    <div key={item?.title} className="relative">
                      {renderNavItem(item)}
                    </div>
                  ))}
              </div>

              <div className="flex justify-center lg:pr-14 lg:pl-14 lg:flex-none">
                <Link href="/" className="flex items-center">
                  <img
                    src={data?.allSettingsList[0]?.logo}
                    alt="Dubblin Logo"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
              </div>

              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-start lg:space-x-10">
                {(userInfo
                  ? navigation.slice(2) // Order History, About us, Shop, New Arrivals, Sale
                  : navigation.slice(2, 4)
                ) // New Arrivals, Sale
                  .map((item) => (
                    <div key={item.title} className="relative">
                      {renderNavItem(item)}
                    </div>
                  ))}
                <div className="flex items-center w-52 borderm justify-end space-x-6">
                  <button
                    onClick={toggleSearch}
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Search className="h-6 w-6" />
                  </button>
                  {/* <button className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                    <Link href="/login">
                      <User className="h-6 w-6" />
                    </Link>
                  </button> */}
                  <button
                    className="text-gray-700 relative hover:text-gray-900 transition-colors duration-200"
                    onClick={() => {
                      setShowCart(true);
                    }}
                  >
                    <ShoppingCart className="h-6 w-6 " />
                    <div className="absolute rounded-full p-1 w-4 flex justify-center items-center h-4 bg-black text-xs text-white -top-2 -right-2">
                      {cart?.length}
                    </div>
                  </button>
                </div>
              </div>

              <div className="lg:hidden flex items-center space-x-4">
                <button
                  onClick={toggleSearch}
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  <Search className="h-5 w-5" />
                </button>
                {/* <button className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                  <Link href="/login">
                    <User className="h-6 w-6" />
                  </Link>
                </button> */}
                <button
                  className="text-gray-700 relative hover:text-gray-900 transition-colors duration-200"
                  onClick={() => {
                    setShowCart(true);
                  }}
                >
                  <ShoppingCart className="h-6 w-6 " />
                  <div className="absolute rounded-full p-1 w-4 flex justify-center items-center h-4 bg-black text-xs text-white -top-2 -right-2">
                    {cart?.length}
                  </div>
                </button>
                <button
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  onClick={toggleMobileMenu}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {activeMegaMenu && (
          <div className="absolute left-0 w-full bg-white shadow-lg z-50 hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-6 gap-8">
                {navigation
                  .find((item) => item?.title === activeMegaMenu)
                  ?.sections?.map((section, idx) => (
                    <div key={idx} className="space-y-4 ">
                      <a
                        href={section?.href || ""}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        <h2 className="font-medium text-gray-900 ">
                          {section?.title}
                        </h2>
                      </a>
                      <ul className="space-y-2">
                        {section?.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <a
                              href={link?.href}
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              {link?.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div
          className={`fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white z-[70] shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <Image
              src="/Logo.png"
              alt="Dubblin Logo"
              width={100}
              height={33}
              className="h-8 w-auto"
            />
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-full pb-20 z-50">
            {navigation?.map((item) => (
              <div key={item?.title} className="border-b">
                {item?.sections?.length > 0 ? (
                  <>
                    <button
                      onClick={() => {
                        toggleMobileDropdown(item?.title);
                        setActiveItem(item?.title);
                      }}
                      className={`flex justify-between items-center w-full p-5 text-left ${
                        activeItem === item?.title
                          ? "text-black underline"
                          : "text-gray-700"
                      } hover:text-gray-900`}
                    >
                      {item?.title}
                      <ChevronRight
                        className={`h-5 w-5 transform transition-transform ${
                          activeMobileDropdown === item?.title
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </button>
                    {activeMobileDropdown === item?.title && (
                      <div className="bg-gray-50 p-4">
                        {item?.sections?.map((section, idx) => (
                          <div key={idx} className="mb-4 ">
                            <h3 className="font-medium text-gray-900 mb-2">
                              <a
                                href={section?.href || ""}
                                className="font-medium text-gray-900 hover:underline"
                              >
                                {section?.title}
                              </a>
                            </h3>
                            <ul className="space-y-2 ">
                              {section?.links?.map((link, linkIdx) => (
                                <li key={linkIdx}>
                                  <a
                                    href={link.href}
                                    className={`text-sm ${
                                      activeItem === link?.title
                                        ? "text-gray-900 underline"
                                        : "text-gray-600"
                                    } hover:text-gray-900`}
                                    onClick={() => {
                                      toggleMobileMenu();
                                      setActiveItem(link?.title);
                                    }}
                                  >
                                    {link?.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className={`block w-full p-4 text-left ${
                      activeItem === item?.title
                        ? "text-gray-900 underline"
                        : "text-gray-700"
                    } hover:text-gray-900`}
                    onClick={() => {
                      toggleMobileMenu();
                      setActiveItem(item?.title);
                    }}
                  >
                    {item?.title}
                  </a>
                )}
              </div>
            ))}
            {usernavigationconfig?.map((item) => (
              <div key={item?.title} className="border-b">
                {item?.sections?.length > 0 ? (
                  <>
                    <button
                      onClick={() => {
                        toggleMobileDropdown(item?.title);
                        setActiveItem(item?.title);
                      }}
                      className={`flex justify-between items-center w-full p-5 text-left ${
                        activeItem === item?.title
                          ? "text-black underline"
                          : "text-gray-700"
                      } hover:text-gray-900`}
                    >
                      {item?.title}
                      <ChevronRight
                        className={`h-5 w-5 transform transition-transform ${
                          activeMobileDropdown === item?.title
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </button>
                    {activeMobileDropdown === item?.title && (
                      <div className="bg-gray-50 p-4">
                        {item?.sections?.map((section, idx) => (
                          <div key={idx} className="mb-4 ">
                            <h3 className="font-medium text-gray-900 mb-2">
                              {section?.title}
                            </h3>
                            <ul className="space-y-2 ">
                              {section?.links?.map((link, linkIdx) => (
                                <li key={linkIdx}>
                                  <a
                                    href={link.linkHref}
                                    className={`text-sm ${
                                      activeItem === link?.linkTitle
                                        ? "text-gray-900 underline"
                                        : "text-gray-600"
                                    } hover:text-gray-900`}
                                    onClick={() => {
                                      toggleMobileMenu();
                                      setActiveItem(link?.linkTitle);
                                    }}
                                  >
                                    {link?.linkTitle}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item?.href}
                    className={`block w-full p-4 text-left ${
                      activeItem === item?.title
                        ? "text-gray-900 underline"
                        : "text-gray-700"
                    } hover:text-gray-900`}
                    onClick={() => {
                      toggleMobileMenu();
                      setActiveItem(item?.title);
                    }}
                  >
                    {item?.title}
                  </a>
                )}
              </div>
            ))}
            {/* <div className="w-full px-2">
              <button
                className="bg-black text-white w-full py-2 px-2 rounded-sm  mt-4"
                onClick={() => {
                  userInfo?.email ? handlelogout() : router.push("/login");
                }}
              >
                {!userInfo?.email ? "LOG IN" : "LOG OUT"}/
              </button>
            </div> */}
          </div>
        </div>
      </header>
      <SearchComponent
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        handleSearchChange={handleSearchChange}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        collections={collections}
        suggestions={suggestions}
      />

      {showCart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md font-Outfit flex items-center justify-end z-50 text-gray-800 transition-opacity duration-300">
          <div className="bg-white h-screen w-full md:w-2/5 shadow-xl transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            <div className="flex-grow overflow-y-auto py-4 px-6 hide-scrollbar">
              {cartItems?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative">
                    <ShoppingCart size={80} className="text-gray-200" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#AA0A30] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      0
                    </div>
                  </div>
                  <p className="text-xl font-medium text-gray-500 mt-6">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 bg-[#AA0A30] text-white px-6 py-3 rounded-xl hover:bg-pink-800 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems?.map((item, index) => (
                  <div
                    key={index}
                    className="group mb-5 overflow-hidden rounded-2xl border border-gray-100 hover:border-pink-700 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex p-4 items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={item?.item_img || "/placeholder.svg"}
                          alt={item?.variations?.productId?.name}
                          className="w-24 h-24 object-cover rounded-xl shadow-sm"
                        />
                      </div>

                      <div className="ml-4 flex-grow">
                        <h3 className="font-semibold text-lg">
                          {item?.variations?.productId?.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {item?.variations?.values
                            .map((e: any) => e?.short_name)
                            .join(", ")}
                        </p>
                        <div className="mt-2 flex items-center">
                          <p className="font-bold">
                            &#8377;
                            {item?.variations?.special_price?.toFixed(2)} x{" "}
                            {item?.quantity}
                            {/* {item?.variations?.price?.toFixed(2) * item?.quantity} */}
                          </p>
                        </div>
                      </div>

                      <div className="ml-auto flex flex-col items-end">
                        <p className="font-bold text-lg">
                          ₹
                          {(
                            item?.variations?.special_price * item?.quantity
                          ).toFixed(2)}
                        </p>
                        <button
                          onClick={() => dispatch(removeItems(item))}
                          className="mt-2 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="h-px bg-gray-200 w-full" />

                <div className="p-6 space-y-4">
                  {/* <div className="flex justify-between items-center">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">
              ₹{cartItems
                .reduce(
                  (total, item) => total + (item?.variations?.price ?? 0) * item.quantity,
                  0
                )
                .toFixed(2)}
            </span>
          </div> */}

                  {/* <div className="flex justify-between items-center">
            <span className="text-gray-500">Shipping</span>
            <span className="font-medium text-green-500">Free</span>
          </div> */}

                  {/* <div className="h-px bg-gray-200 w-full my-2" /> */}

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-700">
                      ₹
                      {cartItems
                        .reduce(
                          (total, item) =>
                            total +
                            (item?.variations?.special_price ?? 0) *
                              item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="w-full bg-pink-700 text-white py-4 font-medium hover:bg-pink-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow mt-4 disabled:opacity-50"
                    disabled={cartItems?.length === 0 || loading}
                    onClick={handleCheckout}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        PLACE ORDER
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
