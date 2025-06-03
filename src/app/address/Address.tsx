"use client";

import type React from "react";
import { useState, useEffect } from "react";
// import { Dashboard, PersonalInfo, EditAddress, OrderHistory } from '../profile/page'
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "../../lib/store";
import { useAppDispatch } from "../../lib/hooks";
import {
  AddShippingAddress,
  DeleteShippingAddress,
  fetchCitiesList,
  fetchCountriesList,
  fetchStateList,
  UpdateShippingAddress,
} from "../../lib/AllSlices/shippingAddressSlice";
import Select from "react-select";
import { toast } from "sonner";
import {
  LogOut,
  User,
  Home,
  MapPin,
  Clock,
  ChevronRight,
  Settings,
  PencilLine,
  Trash2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define interfaces for form data
interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

// Define interface for event handlers
interface InputChangeEvent
  extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {
  target: HTMLInputElement | HTMLSelectElement;
}

const AddressFormPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  Address: any;
  initialData?: FormData;
  userId?: string;
}> = ({ isOpen, onClose, Address, isEditing, userId }) => {
  if (!isOpen) return null;
  const { countriesListState, StateListState, CitiesListState } = useSelector(
    (state: RootState) => state.shippingAddress
  );

  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<FormData>(() => {
    // Initialize form data with Address data if available, otherwise use default values
    if (Address) {
      return {
        firstName: Address.firstname || "",
        lastName: Address.lastname || "",
        company: Address.company || "",
        address1: Address.address1 || "",
        address2: Address.address2 || "",
        // city: Address.city || "",
        country: Address.country || "",
        state: Address.state || "",
        postalCode: Address.pincode || "",
        phone: Address.phone || "",
        isDefault: Address.isDefault || false,
      };
    }

    return {
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      // city: "",
      country: "",
      state: "",
      postalCode: "",
      phone: "",
      isDefault: false,
    };
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    postalCode: "",
    phone: "",
    country: "",
    state: "",
  });

  // Validation functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        firstName: "First name is required",
      }));
      return false;
    }

    if (name.length < 2) {
      setFormErrors((prev) => ({
        ...prev,
        firstName: "First name must be at least 2 characters",
      }));
      return false;
    }

    if (name.includes(" ")) {
      setFormErrors((prev) => ({
        ...prev,
        firstName: "First name cannot contain spaces",
      }));
      return false;
    }

    if (!/^[a-zA-Z'-]+$/.test(name)) {
      setFormErrors((prev) => ({
        ...prev,
        firstName:
          "First name can only contain letters, hyphens and apostrophes",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, firstName: "" }));
    return true;
  };

  const validateLastName = (name: string) => {
    if (!name.trim()) {
      setFormErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
      return false;
    }

    if (name.trim().length < 2) {
      setFormErrors((prev) => ({
        ...prev,
        lastName: "Last name must be at least 2 characters",
      }));
      return false;
    }

    if (!/^[a-zA-Z\s-']+$/.test(name)) {
      setFormErrors((prev) => ({
        ...prev,
        lastName:
          "Last name can only contain letters, spaces, hyphens and apostrophes",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, lastName: "" }));
    return true;
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      setFormErrors((prev) => ({ ...prev, phone: "" }));
      return true;
    }

    // Basic phone validation (allows various formats)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone)) {
      setFormErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validateAddress = (address) => {
    if (!address.trim()) {
      setFormErrors((prev) => ({ ...prev, address1: "Address is required" }));
      return false;
    }

    if (address.length < 5) {
      setFormErrors((prev) => ({
        ...prev,
        address1: "Please enter a complete address",
      }));
      return false;
    }

    setFormErrors((prev) => ({ ...prev, address1: "" }));
    return true;
  };

  const validateCountryState = () => {
    let isValid = true;

    if (!idformdata.country_id) {
      setFormErrors((prev) => ({
        ...prev,
        country: "Please select a country",
      }));
      isValid = false;
    } else {
      setFormErrors((prev) => ({ ...prev, country: "" }));
    }

    if (!idformdata.state_id) {
      setFormErrors((prev) => ({ ...prev, state: "Please select a state" }));
      isValid = false;
    } else {
      setFormErrors((prev) => ({ ...prev, state: "" }));
    }

    return isValid;
  };

  const [idformdata, setIdformdata] = useState(() => {
    if (Address) {
      return {
        // city_id: Address.city._id || "",
        country_id: Address.country._id || "",
        state_id: Address.state._id || "",
      };
    }
    return {
      // city_id: "",
      country_id: "",
      state_id: "",
    };
  });

  useEffect(() => {
    dispatch(fetchCitiesList({ state: formData.state }));
    dispatch(fetchCountriesList());
    dispatch(fetchStateList({ country: formData.country }));
  }, [formData.country, formData.state]);

  const handleChange = (e: InputChangeEvent): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Validate the field as the user types
    if (name === "firstName") validateFirstName(value);
    if (name === "lastName") validateLastName(value);
    if (name === "address1") validateAddress(value);
    if (name === "phone") validatePhone(value);
  };

  const handleNewAddress = (AddressId: any): void => {
    // Validate all fields
    const isFirstNameValid = validateFirstName(formData.firstName);
    const isLastNameValid = validateLastName(formData.lastName);
    const isAddressValid = validateAddress(formData.address1);
    const isPhoneValid = validatePhone(formData.phone);
    const isCountryStateValid = validateCountryState();

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isAddressValid ||
      !isPhoneValid ||
      !isCountryStateValid
    ) {
      toast.error("Please fix the errors in the form");
      return;
    }
    // Handle update logic here
    if (AddressId) {
      if (
        formData.firstName === "" ||
        formData.lastName === "" ||
        formData.address1 === "" ||
        // idformdata.city_id === "" ||
        idformdata.country_id === "" ||
        idformdata.state_id === "" ||
        formData.postalCode === "" ||
        formData.phone === ""
      ) {
        toast.error("Please fill all the fields");
        return;
      }
      dispatch(
        UpdateShippingAddress({
          shippingaddress: {
            firstname: formData.firstName,
            lastname: formData.lastName,
            company: formData.company,
            address1: formData.address1,
            address2: formData.address2,
            country: idformdata.country_id,
            state: idformdata.state_id,
            pincode: formData.postalCode,
            userId: userId,
            phone: formData.phone,
            isDefault: formData.isDefault,
          },
          addressId: AddressId,
        })
      ).then((response) => {
        toast.success("Address Updated Successfully");
        onClose();
        window.location.reload();
      });
    } else {
      if (
        formData.firstName === "" ||
        formData.lastName === "" ||
        formData.address1 === "" ||
        // idformdata.city_id === "" ||
        idformdata.country_id === "" ||
        idformdata.state_id === "" ||
        formData.postalCode === "" ||
        formData.phone === ""
      ) {
        toast.error("Please fill all the fields");
        return;
      }
      dispatch(
        AddShippingAddress({
          shippingaddress: {
            firstname: formData.firstName,
            lastname: formData.lastName,
            company: formData.company,
            address1: formData.address1,
            address2: formData.address2,
            country: idformdata.country_id,
            state: idformdata.state_id,
            pincode: formData.postalCode,
            userId: userId,
            phone: formData.phone,
            isDefault: formData.isDefault,
          },
        })
      ).then(() => {
        toast.success("Address Added Successfully");
        onClose();
        window.location.reload();
      });
    }
  };

  const [selectedOptions, setSelectedOptions] = useState({
    // city: Address
    //   ? {
    //       value: { cityid: Address.city.id, city_id: Address.city._id },
    //       label: Address.city.name,
    //     }
    //   : null,
    country: Address
      ? {
          value: {
            countryid: Address.country.id,
            country_id: Address.country._id,
          },
          label: Address.country.name,
        }
      : null,
    state: Address
      ? {
          value: { stateid: Address.state.id, state_id: Address.state._id },
          label: Address.state.name,
        }
      : null,
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center m-2 md:m-0">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`border ${
                  formErrors.firstName ? "border-red-500" : "border-gray-300"
                } p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">
                Last Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`border ${
                  formErrors.lastName ? "border-red-500" : "border-gray-300"
                } p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium block">
              Address Line 1<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className={`border ${
                formErrors.address1 ? "border-red-500" : "border-gray-300"
              } p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
            />
            {formErrors.address1 && (
              <p className="text-red-500 text-sm mt-1">{formErrors.address1}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium block">
              Address Line 2
            </label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className={`border ${
                formErrors.address2 ? "border-red-500" : "border-gray-300"
              } p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
            />
            {formErrors.address2 && (
              <p className="text-red-500 text-sm mt-1">{formErrors.address2}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium block">
              Country<span className="text-red-500">*</span>
            </label>
            <Select
              className={`text-gray-800 rounded-lg ${
                formErrors.country ? "border-red-500" : ""
              }`}
              classNamePrefix="select"
              name="country"
              value={selectedOptions.country}
              options={countriesListState?.data?.map((country) => ({
                value: { countryid: country?.id, country_id: country?._id },
                label: country?.name,
              }))}
              onChange={(selected: any) => {
                setSelectedOptions((prev) => ({
                  ...prev,
                  country: selected,
                }));
                setFormData((prev) => ({
                  ...prev,
                  country: selected?.value.countryid || "",
                }));
                setIdformdata((prev) => ({
                  ...prev,
                  country_id: selected?.value.country_id || "",
                }));
                // Clear error when a selection is made
                setFormErrors((prev) => ({ ...prev, country: "" }));
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  padding: "4px",
                  borderRadius: "0.5rem",
                  borderColor: formErrors.country ? "#ef4444" : "#d1d5db",
                }),
              }}
            />
            {formErrors.country && (
              <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium block">
              State<span className="text-red-500">*</span>
            </label>
            <Select
              className={`text-gray-800 rounded-lg ${
                formErrors.state ? "border-red-500" : ""
              }`}
              classNamePrefix="select"
              name="state"
              value={selectedOptions.state}
              options={StateListState?.data?.map((state) => ({
                value: { stateid: state?.id, state_id: state?._id },
                label: state?.name,
              }))}
              onChange={(selected: any) => {
                setSelectedOptions((prev) => ({
                  ...prev,
                  state: selected,
                }));
                setFormData((prev) => ({
                  ...prev,
                  state: selected?.value.stateid || "",
                }));
                setIdformdata((prev) => ({
                  ...prev,
                  state_id: selected?.value.state_id || "",
                }));
                // Clear error when a selection is made
                setFormErrors((prev) => ({ ...prev, state: "" }));
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  padding: "4px",
                  borderRadius: "0.5rem",
                  borderColor: formErrors.state ? "#ef4444" : "#d1d5db",
                }),
              }}
            />
            {formErrors.state && (
              <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">
                Postal/Zip Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">
                Phone<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`border ${
                  formErrors.phone ? "border-red-500" : "border-gray-300"
                } p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="mt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-5 w-5 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
              />
              <span className="text-gray-700">Set as default address</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => handleNewAddress(Address?._id || null)}
              className="bg-pink-700 hover:bg-pink-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeletePopup: React.FC<{
  isDelete: boolean;
  onClose: () => void;
  Address: any;
}> = ({ isDelete, onClose, Address }) => {
  if (!isDelete) return null;

  const dispatch = useAppDispatch();

  const handleDelete = (id) => {
    dispatch(DeleteShippingAddress({ addressId: id })).then(() => {
      toast.success("Address Deleted Successfully");
      onClose();
      window.location.reload();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="bg-red-100 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Delete Address
          </h3>
          <p className="text-gray-600">
            Are you sure you want to delete this address? This action cannot be
            undone.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleDelete(Address._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

interface UserInfoProps {
  userInfo: any;
  AddressInfo: [];
}

const Address: React.FC<UserInfoProps> = (props) => {
  const router = useRouter();
  const { userInfo, AddressInfo } = props;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(false);
  const [address, setAddress] = useState(null);

  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Ensure the component only renders on the client-side
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent SSR mismatch

  const handleNewAddress = () => {
    setIsEditing(false);
    setAddress(null);
    setIsPopupOpen(true);
  };
  const handleUpdate = (address) => {
    // Handle update logic here
    setAddress(address);
    setIsEditing(true);
    setIsPopupOpen(true);
  };

  const menuItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      active: true,
    },
    {
      icon: <User size={20} />,
      label: "Personal Info",
      href: "/personal-info",
    },
    { icon: <MapPin size={20} />, label: "Addresses", href: "/address" },
    {
      icon: <Clock size={20} />,
      label: "Order History",
      href: "/order-history",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push("/");
      toast.success("Logged out successfully");
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleDelete = (address) => {
    // Handle cancel logic here
    setAddress(address);
    setIsDelete(true);
  };

  const handleDeliver = (adressId) => {
    // Handle cancel logic here
    dispatch(
      UpdateShippingAddress({
        shippingaddress: {
          isDefault: true,
        },
        addressId: adressId,
      })
    ).then((res) => {
      toast.success("Address set as default");
      window.location.reload();
    });
  };

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

  return (
    <div className="font-Outfit bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-pink-900 to-pink-500 py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto flex items-center justify-between relative z-10">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Manage Your Addresses</h1>
            <p className="text-pink-100 mt-2">
              Add, edit or remove your shipping addresses
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              <MapPin size={32} className="text-white" />
            </div>
          </div>
        </div>
        {/* Abstract shapes for visual appeal */}
        <div className="absolute -bottom-8 left-0 w-full h-32 bg-gray-50 rounded-t-[50%] transform translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full -mr-32 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/20 rounded-full -ml-20 -mb-20"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative -mt-12">
        <div className="lg:flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-1/5 sticky top-16 h-fit">
            <div className="bg-white shadow-sm rounded-xl p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                My Account
              </h2>
              <nav>
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href}>
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            item.href === "/address"
                              ? "bg-pink-50 text-pink-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={
                                item.href === "/address"
                                  ? "text-pink-600"
                                  : "text-gray-500"
                              }
                            >
                              {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.href === "/address" && (
                            <ChevronRight size={16} className="text-pink-600" />
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Log Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Address Content */}
          <div className="flex-1 space-y-6 mb-10">
            {/* Mobile Navigation */}
            <div className="lg:hidden bg-white shadow-sm rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Addresses</h2>
              </div>
            </div>

            {/* Address Management Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Your Addresses
                </h3>
                <button
                  onClick={handleNewAddress}
                  className="px-4 py-2 bg-pink-700 text-white rounded-lg text-sm font-medium hover:bg-pink-800 transition-colors"
                >
                  Add New Address
                </button>
              </div>

              {/* Default Address Section */}
              {AddressInfo.filter((a) => a.isDefault === true).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">
                    Default Address
                  </h4>
                  {AddressInfo.filter((a) => a?.isDefault === true).map((a) => (
                    <div
                      key={a?._id}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{`${a?.firstname} ${a?.lastname}`}</p>
                          <div className="mt-2 space-y-1 text-gray-600">
                            <p>{a?.address1}</p>
                            <p>{a?.address2}</p>
                            <p>{a?.pincode}</p>
                            <p>{`${a?.state?.name}, ${a?.country?.name}`}</p>
                            <p className="font-medium mt-1">{a?.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(a)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          >
                            <PencilLine size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(a)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other Addresses Section */}
              {AddressInfo.filter((a) => a.isDefault === false).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">
                    Other Addresses
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {AddressInfo.filter((a) => a.isDefault === false).map(
                      (a) => (
                        <div
                          key={a._id}
                          className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-gray-800">{`${a?.firstname} ${a?.lastname}`}</p>
                              <div className="mt-2 space-y-1 text-gray-600">
                                <p>{a?.address1}</p>
                                <p>{a?.state?.name}</p>
                                <p>{a?.country?.name}</p>
                              </div>
                              <button
                                onClick={() => handleDeliver(a?.userId)}
                                className="mt-3 text-pink-700 hover:text-pink-800 text-sm font-medium flex items-center"
                              >
                                Set as default
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(a)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                              >
                                <PencilLine size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(a)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* No Addresses Message */}
              {AddressInfo.length === 0 && (
                <div className="text-center py-10">
                  <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-700">
                    No addresses saved yet
                  </h4>
                  <p className="text-gray-500 mt-1">
                    Add your first shipping address to get started
                  </p>
                  <button
                    onClick={handleNewAddress}
                    className="mt-4 inline-block px-5 py-2 bg-pink-700 text-white rounded-lg font-medium hover:bg-pink-800 transition-colors"
                  >
                    Add New Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AddressFormPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        isEditing={isEditing}
        userId={userInfo._id}
        Address={address}
      />

      <DeletePopup
        isDelete={isdelete}
        onClose={() => setIsDelete(false)}
        Address={address}
      />
    </div>
  );
};

export default Address;
export const dynamic = "force-dynamic";
