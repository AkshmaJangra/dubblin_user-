"use client";
import React, { useState, useEffect, JSX, use } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  AddShippingAddress,
  BillingAddress,
  DeleteBillingSuccess,
  DeleteShippingAddress,
  fetchCitiesList,
  fetchCountriesList,
  fetchCountryById,
  fetchStateById,
  fetchStateList,
  UpdateShippingAddress,
} from "../../lib/AllSlices/shippingAddressSlice"; // Import the action

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  CartItem,
  clearCart,
  removeItems,
} from "../../lib/AllSlices/cartSlice";
import {
  createOrder,
  updateOrder,
  verifyPayment,
} from "../../lib/AllSlices/orderSlice"; // Import createOrder action
import { verifyPromoCode } from "../../lib/AllSlices/discountSlice"; // Import verifyPromoCode action
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "../../lib/hooks";
import { AppDispatch } from "../../lib/store";
import { fetchCartItemsData } from "../../lib/AllSlices/getCartItemsSlice";
import { Divide } from "lucide-react";

let SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_APP_SITE_KEY || "";
// import { colourOptions } from '../data';
console.log('site keby', SITE_KEY);
interface RootState {
  cart?: {
    cartlist: CartItem[];
  };
  shippingAddress?: {
    shippingAddresslist?: any;
    countriesListState?: any;
    StateListState?: any;
    CitiesListState?: any;
    BillingAddressState?: any;
  };
}

export interface billingAddresslg1 {
  firstname?: any;
  lastname?: any;
  address1?: any;
  address2?: any;
  country?: any;
  state?: any;
  pincode?: any;
  phone?: any;
}

interface UserInfoProps {
  UserInfo: any;
  addressData: any;
}
const DeletePopup: React.FC<{
  isDelete: boolean;
  onClose: () => void;

  Address: any;
}> = ({ isDelete, onClose, Address }) => {
  if (!isDelete) return null;

  const dispatch = useAppDispatch();

  const handleDelete = (id: any) => {
    dispatch(DeleteShippingAddress({ addressId: id })).then(() => {
      toast.success("Address deleted successfully");
      onClose();
      window.location.reload();
    });
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg relative p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className=" absolute top-2 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="py-2 text-lg mb-3">
          <p className=" text-black">Are you sure?</p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => handleDelete(Address._id)}
            className=" bg-red-600 p-1 px-2.5 text-white rounded-md"
          >
            Delete
          </button>
          <button
            className=" bg-black p-1 px-2.5 text-white rounded-md"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressFormPopup: React.FC<{
  isOpen: boolean;
  onClose: (x) => void;
  isEditing: boolean;
  Address: any;
  initialData?: FormData;
  userId?: string;
  isBilling?: boolean;
}> = ({ isOpen, onClose, Address, isEditing, userId, isBilling }) => {
  if (!isOpen) return null;
  const { countriesListState, StateListState, CitiesListState } = useSelector(
    (state: RootState) => state.shippingAddress
  );
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState(() => {
    // Initialize form data with Address data if available, otherwise use default values
    if (Address) {
      return {
        firstName: Address.firstname || "",
        lastName: Address.lastname || "",
        company: Address.company || "",
        address1: Address.address1 || "",
        address2: Address.address2 || "",
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
      country: "",
      state: "",
      postalCode: "",
      phone: "",
      isDefault: true,
    };
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",

    address1: "",
    address2: "",
    postalCode: "",
    phone: "",
    country: "",
    state: ""
  })

  // Validation functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      setFormErrors(prev =>
        ({ ...prev, firstName: "name is required" }))
      return false
    }

    if (name.length < 2) {
      setFormErrors(prev =>
        ({ ...prev, firstName: "name must be at least 2 characters" }))
      return false
    }

    setFormErrors(prev => ({ ...prev, firstName: "" }))
    return true
  }

  const validateLastName = (name: string) => {

    setFormErrors(prev => ({ ...prev, lastName: "" }))
    return true
  }

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      setFormErrors(prev => ({ ...prev, phone: "" }))
      return true
    }

    // Basic phone validation (allows various formats)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    if (!phoneRegex.test(phone)) {
      setFormErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }))
      return false
    }

    setFormErrors(prev => ({ ...prev, phone: "" }))
    return true
  }

  const validateAddress = (address: any) => {
    if (!address.trim()) {
      setFormErrors(prev => ({ ...prev, address1: "Address is required" }))
      return false
    }

    if (address.length < 5) {
      setFormErrors(prev => ({ ...prev, address1: "Please enter a complete address" }))
      return false
    }

    setFormErrors(prev => ({ ...prev, address1: "" }))
    return true
  }

  const validateCountryState = () => {
    let isValid = true

    if (!idformdata.country_id) {
      setFormErrors(prev => ({ ...prev, country: "Please select a country" }))
      isValid = false
    } else {
      setFormErrors(prev => ({ ...prev, country: "" }))
    }

    if (!idformdata.state_id) {
      setFormErrors(prev => ({ ...prev, state: "Please select a state" }))
      isValid = false
    } else {
      setFormErrors(prev => ({ ...prev, state: "" }))
    }

    return isValid
  }

  const [idformdata, setIdformdata] = useState(() => {
    if (Address) {
      return {
        country_id: Address.country._id || "",
        state_id: Address.state._id || "",
      };
    }
    return {
      //   city_id: "",
      country_id: "",
      state_id: "",
    };
  });

  useEffect(() => {
    dispatch(fetchCitiesList({ state: formData.state }));
    dispatch(fetchCountriesList());
    dispatch(fetchStateList({ country: formData.country }));
  }, [formData.country, formData.state]);

  const handleChange = (e: any): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // setIdformdata({
    //   ...idformdata,

    // })

    // Validate the field as the user types
    if (name === "firstName") validateFirstName(value)
    // if (name === "lastName") validateLastName(value)
    if (name === "address1") validateAddress(value)
    if (name === "phone") validatePhone(value)
  };

  const handleNewAddress = (AddressId: any): void => {
    // Validate all fields
    const isFirstNameValid = validateFirstName(formData.firstName)
    // const isLastNameValid = validateLastName(formData.lastName)
    const isAddressValid = validateAddress(formData.address1)
    const isPhoneValid = validatePhone(formData.phone)
    const isCountryStateValid = validateCountryState()

    if (!isFirstNameValid || !isAddressValid ||
      !isPhoneValid || !isCountryStateValid) {
      toast.error("Please fix the errors in the form")
      return
    }
    // Handle update logic here
    if (AddressId) {
      if (
        formData.firstName === "" ||

        formData.address1 === "" ||
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
      ).then(() => {
        toast.success("Address updated successfully");
        onClose(1);
        window.location.reload();
      });
    } else if (isBilling === true) {
      if (
        formData.firstName === "" ||

        formData.address1 === "" ||
        idformdata.country_id === "" ||
        idformdata.state_id === "" ||
        formData.postalCode === "" ||
        formData.phone === ""
      ) {
        toast.error("Please fill all the fields");
        return;
      }
      dispatch(
        BillingAddress({
          billingaddress: {
            firstname: formData.firstName,
            lastname: formData.lastName,
            address1: formData.address1,
            address2: formData.address2,
            country: idformdata.country_id,
            state: idformdata.state_id,
            pincode: formData.postalCode,
            userId: userId,
            phone: formData.phone,
            // isDefault: formData.isDefault,
          },
        })
      ).then(() => {
        toast.success(" Billing Address added successfully");
        onClose(1);
        window.location.reload();
      });
    } else {
      if (
        formData.firstName === "" ||
        formData.address1 === "" ||
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
        toast.success("Address added successfully");
        onClose(1);
        window.location.reload();
      });
    }
  };

  const [selectedOptions, setSelectedOptions] = useState({
    country: Address
      ? {
        value: {
          countryid: Address.country.id,
          country_id: Address.country._id,
        },
        label: Address.country.name, // Assuming country_name exists in Address
      }
      : null,
    state: Address
      ? {
        value: { stateid: Address.state.id, state_id: Address.state._id },
        label: Address.state.name, // Assuming state_name exists in Address
      }
      : null,
  });


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center m-2 md:m-0">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl text-black font-semibold">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={() => onClose(0)}
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">Full Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
            </div>

            <div className="space-y-2 hidden">
              <label className="text-gray-700 font-medium block">Last Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`border border-gray-300 p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium block">Address Line 1<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className={`border ${formErrors.address1 ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
            />
            {formErrors.address1 && <p className="text-red-500 text-sm mt-1">{formErrors.address1}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium block">Address Line 2</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className={`border ${formErrors.address2 ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
            />
            {formErrors.address2 && <p className="text-red-500 text-sm mt-1">{formErrors.address2}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-gray-700 font-medium block">Country<span className="text-red-500">*</span></label>
            <Select
              className={`text-gray-800 rounded-lg ${formErrors.country ? 'border-red-500' : ''}`}
              classNamePrefix="select"
              name="country"
              value={selectedOptions.country}
              options={countriesListState?.data?.map((country) => ({
                value: { countryid: country.id, country_id: country._id },
                label: country.name,
              }))}
              onChange={(selected: any) => {
                setSelectedOptions((prev) => ({
                  ...prev,
                  country: selected,
                }))
                setFormData((prev) => ({
                  ...prev,
                  country: selected?.value.countryid || "",
                }))
                setIdformdata((prev) => ({
                  ...prev,
                  country_id: selected?.value.country_id || "",
                }))
                // Clear error when a selection is made
                setFormErrors(prev => ({ ...prev, country: "" }))
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
            {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">State<span className="text-red-500">*</span></label>
              <Select
                className={`text-gray-800 rounded-lg ${formErrors.state ? 'border-red-500' : ''}`}
                classNamePrefix="select"
                name="state"
                value={selectedOptions.state}
                options={StateListState?.data?.map((state) => ({
                  value: { stateid: state.id, state_id: state._id },
                  label: state.name,
                }))}
                onChange={(selected: any) => {
                  setSelectedOptions((prev) => ({
                    ...prev,
                    state: selected,
                  }))
                  setFormData((prev) => ({
                    ...prev,
                    state: selected?.value.stateid || "",
                  }))
                  setIdformdata((prev) => ({
                    ...prev,
                    state_id: selected?.value.state_id || "",
                  }))
                  // Clear error when a selection is made
                  setFormErrors(prev => ({ ...prev, state: "" }))
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
              {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">Postal/Zip Code<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">Phone<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
            </div>
          </div>

          {isBilling !== true && (
            <div className="mt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">Set as default address</span>
              </label>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => handleNewAddress(Address?._id || null)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
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

const AddressesPopup = (props) => {
  const { userInfo, AddressInfo, open, close } = props;
  if (open) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isdelete, setIsDelete] = useState(false);
    const [address, setAddress] = useState(null);
    const [checkedAddresses, setCheckedAddresses] = useState({});

    const dispatch = useAppDispatch();
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

    const handleDelete = (address) => {
      // Handle cancel logic here
      setAddress(address);
      setIsDelete(true);
    };
    const handleCheck = (addressId: any) => {
      setCheckedAddresses((prev) => ({
        ...prev,
        [addressId]: !prev[addressId],
      }));
    };
    const handleDeliver = (adressId: any) => {
      // Handle cancel logic here
      dispatch(
        UpdateShippingAddress({
          shippingaddress: {
            isDefault: true,
            userId: userInfo?._id,
          },
          addressId: adressId,
        })
      ).then(() => {
        close();
        window.location.reload();
      });
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
          <button
            className="absolute right-2 top-2 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 transition-colors duration-200"
            onClick={() => close()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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

          {AddressInfo.length != 0 && (
            <div className="w-full p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Your Addresses
                </h2>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mr-5"
                  onClick={handleNewAddress}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add New Address
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Default Address
                </h3>

                {AddressInfo.filter((a) => a.isDefault === true).map(
                  (a: any) => (
                    <div
                      className="bg-gray-50 border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow"
                      key={a._id}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <p className="text-lg font-semibold text-gray-800">{`${a?.firstname} ${a?.lastname}`}</p>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Default
                          </span>
                        </div>

                        <div className="space-y-1 text-gray-600">
                          <p>{a?.address1}</p>
                          <p>{a?.pincode}</p>
                          <p>{`${a?.state?.name}, ${a.country.name}`}</p>
                          <p className="flex items-center gap-2 mt-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            {a.phone}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => handleUpdate(a)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(a)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Other Addresses
                </h3>

                <div className="space-y-4">
                  {AddressInfo.filter((a: any) => a.isDefault === false).map(
                    (a: any) => (
                      <div
                        className="bg-gray-50 border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow"
                        key={a._id}
                      >
                        <div className="flex gap-3">
                          <div className="pt-1">
                            <input
                              type="checkbox"
                              checked={checkedAddresses[a._id] || false}
                              onChange={() => handleCheck(a._id)}
                              className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="space-y-2">
                              <p className="text-lg font-semibold text-gray-800">{`${a?.firstname} ${a?.lastname}`}</p>
                              <p className="text-gray-600">{a.country.name}</p>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => handleUpdate(a)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(a)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Delete
                              </button>
                              {checkedAddresses[a._id] && (
                                <button
                                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                  onClick={() => handleDeliver(a._id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                  Deliver Here
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          <AddressFormPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            isEditing={isEditing}
            userId={userInfo?._id}
            Address={address}
          />

          <DeletePopup
            isDelete={isdelete}
            onClose={() => setIsDelete(false)}
            Address={address}
          />
        </div>
      </div>
    );
  }
};

const  CheckoutPage: React.FC<UserInfoProps> =  (props) => {

  const { UserInfo, addressData } = props;

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(null);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((store: RootState) => store?.cart?.items);
  const billingAddress = useSelector(
    (store: RootState) => store?.shippingAddress?.BillingAddressState.data
  );

  const { countriesListState, StateListState, CitiesListState } = useSelector(
    (state: RootState) => state.shippingAddress
  );

  const shippingAddressdata = useSelector(
    (store: RootState) => store.shippingAddress?.shippingAddresslist
  );
  const [guest, setGuest] = useState(true)

  const [formData, setFormData] = useState({
    country: "",
    firstname: "",
    lastname: "",
    address1: "",
    address2: "",
    state: "",
    pinCode: "",
    phone: "",
    email: '',
  });

  // Dispatch the action to send data to the API
  // useEffect(() => {
  //   dispatch(
  //     AddShippingAddress({
  //       shippingaddress: shippingAddressdata,
  //     })
  //   );
  // }, [dispatch, shippingAddressdata]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [newCartItems, setNewCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  const searchParams = useSearchParams(); // Dynamically get URL params
  const [billingAddresslg, setBillingAddresslg] = useState<billingAddresslg1[]>(
    []
  );
  // Initialize state that depends on localStorage only after component mounts
  useEffect(() => {
    setIsClient(true);

    try {
      const stored = localStorage.getItem("billingaddress");
      if (stored) {
        setBillingAddresslg(JSON.parse(stored));
      }

      const billingAddressStatus = localStorage.getItem("billingaddressstatus");
      setIsSameAsShipping(!billingAddressStatus);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  const buynow = searchParams?.get("buynow");
  const uniqueId = searchParams?.get("id");

  useEffect(() => {
    if (!cart || cart.length <= 0) {
      router.push("/");
      return;
    }

    let dataitem;
    if (buynow && uniqueId) {
      let qtyby = 0;
      cart.forEach((item: any) => {
        if (item?._id === uniqueId) {
          qtyby = item?.quantity;
        }
      });
      dataitem = [{ _id: uniqueId, quantity: qtyby }];
    } else {
      dataitem = cart;
    }

    dispatch(fetchCartItemsData({ items: dataitem })).then(async (response) => {
      const data = response.payload;
      if (data?.success) {
        setNewCartItems(data?.itemdata);
        // 👇 Auto-apply default promo if subtotal ≥ 3000

        const subtotal = data?.itemdata?.reduce((total: number, item: any) => {
          return total + (item?.variations?.special_price || 0) * (item?.quantity || 0);
        }, 0);


        if (subtotal >= 3000 && discountCode === "" && appliedDiscount === 0) {
          try {
            const resultAction = await dispatch(
              verifyPromoCode({ promoCode: "DUB10", amount: subtotal })
            );

            if (verifyPromoCode.fulfilled.match(resultAction)) {
              setDiscountCode("DUB10");
              setAppliedDiscount(resultAction?.payload?.discountvalue);
            } else {
              setAppliedDiscount(0);
            }
          } catch (error) {
            console.error("Error auto-applying default promo code:", error);
          }


        }
        if (subtotal < 3000 && discountCode === "DUB10") {
          setDiscountCode("");
          setAppliedDiscount(0);
        }
        // end logic
      } else {
        setNewCartItems([]);
      }

    });
  }, [buynow, uniqueId, cart, router, dispatch]);

  const [show, setShow] = useState<string>("hidden");
  const [check, setCheck] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSameAsCheckBox, setIsSameAsCheckBox] = useState(false);

  const handleForm = () => {
    setShow(check ? "hidden" : "block");
    setCheck(!check);
  };


  const [discountCode, setDiscountCode] = useState<string | null>("" as string);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isSameAsShipping, setIsSameAsShipping] = useState(true);
  const [open1, setOpen1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online'); // Default to online payment


  const [formErrors, setFormErrors] = useState({
    firstname: "",
    email: "",
    lastname: "",
    address1: "",
    address2: "",
    address3: "",
    pinCode: "",
    phone: "",
    country: "",
    state: ""
  })

  //  //Execute reCAPTCHA
  const [reCaptchToken, setReCaptchToken] = useState(null);

useEffect(() => {
  const reCaptchTokenFunction = async () => {
    const token = await window.grecaptcha.execute(SITE_KEY, {
      action: "checkout",
    });
    setReCaptchToken(token);
    console.log("recaptchToken inside useEffect", token);
  };
  reCaptchTokenFunction();
}, [dispatch]);

console.log('', reCaptchToken)

  const [idformdata, setIdformdata] = useState(() => {

    return {

      state_id: "",
    };
  });
  const [selectedOptions, setSelectedOptions] = useState({

    state: null,
  });




  useEffect(() => {

    dispatch(fetchStateList());
  }, [dispatch]);

  useEffect(() => {
    const fetchCountry = async () => {
      const countryId = billingAddresslg?.country;
      if (countryId) {
        try {
          const response = await dispatch(
            fetchCountryById({ countryId })
          ).unwrap();
          setCountryData(response?.country);
        } catch (err) {
          console.error("Failed to fetch country:", err);
        }
      }
    };

    if (isClient && billingAddresslg?.country) {
      fetchCountry();
    }
  }, [billingAddresslg?.country, dispatch, isClient]);

  useEffect(() => {
    const fetchState = async () => {
      const stateId = billingAddresslg?.state;
      if (stateId) {recaptchToken
        try {
          const response = await dispatch(fetchStateById({ stateId })).unwrap();
          setStateData(response?.state);
        } catch (err) {
          console.error("Failed to fetch state:", err);
        }
      }
    };

    if (isClient && billingAddresslg?.state) {
      fetchState();
    }
  }, [billingAddresslg?.state, dispatch, isClient]);

  useEffect(() => {
    // Dynamically load the Razorpay script only on client-side
    if (isClient) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isClient]);

  if (!isClient) {
    // Return a simple loading state or skeleton UI when rendering on the server
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading checkout...</p>
      </div>
    );
  }

  const handleQuantityChange = (
    _id: number,
    type: string,
    matchingVariation: any
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item?._id === _id &&
          JSON.stringify(
            item.matchingVariation.values.map((v: any) => v._id).sort()
          ) ===
          JSON.stringify(matchingVariation.values.map((v: any) => v._id).sort())
          ? {
            ...item,
            quantity:
              type === "increment"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1),
          }
          : item
      )
    );
  };

  const handleRemoveItem = (itemdata: any) => {
    dispatch(removeItems(itemdata));
  };

  const handleApplyDiscount = async () => {
    try {
      const totalAmount = calculateSubtotal();
      const resultAction = await dispatch(
        verifyPromoCode({ promoCode: discountCode, amount: totalAmount })
      );
      if (verifyPromoCode.fulfilled.match(resultAction)) {
        setAppliedDiscount(resultAction?.payload?.discountvalue);
      } else {
        setAppliedDiscount(0);
      }
    } catch (error) {
      console.error("Error verifying promo code:", error);
      setAppliedDiscount(0);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setAppliedDiscount(0);
  };

  const calculateSubtotal = (): number => {
    return newCartItems.reduce(
      (total, item) => total + item?.variations?.special_price * item?.quantity,
      0
    );
  };

  // Calculate online payment discount (5%)
  const calculateOnlineDiscount = () => {
    if (paymentMethod === 'online') {
      const subtotalAfterCoupon = calculateSubtotal() -
        (appliedDiscount >= calculateSubtotal() ? calculateSubtotal() : appliedDiscount);
      return Math.round(subtotalAfterCoupon * 0.05);
    }
    return 0;
  };

  // Calculate total with discounts
  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const couponDiscount = appliedDiscount >= subtotal ? subtotal : appliedDiscount;
    const onlineDiscount = calculateOnlineDiscount();

    const finalAmount = subtotal - couponDiscount - onlineDiscount;
    return finalAmount < 0 ? 0 : finalAmount;
  };

  let shippingAddress = ''
  let addressData1 = {}
  const createProductOrder = async () => {
    setLoading(true);
    if (guest) {
      const isFirstNameValid = validateFirstName(formData.firstname)
      const isEmailValid = validateEmail(formData.email)
      const isPinCodeValid = validatePinCode(formData.pinCode)
      const isAddressValid = validateAddress(formData.address1)
      const isPhoneValid = validatePhone(formData.phone)
      const isCountryStateValid = validateCountryState()

      if (!isFirstNameValid || !isAddressValid ||
        !isPhoneValid || !isCountryStateValid || !isEmailValid || !isPinCodeValid) {
        toast.error("Please fix the errors in the form")
        return
      }
      addressData1 = JSON.stringify({
        ...formData,
        state: idformdata.state_id,
      });
    }
    else {
      if (addressData?.length === 0) {
        toast.error("Please add shipping address");
        setLoading(false);
        return;
      }
      shippingAddress = addressData?.find((a: any) => a.isDefault === true);
      if (!shippingAddress) {
        toast.error("No default shipping address found");
        setLoading(false);
        return;
      }
    }
    const totalAmount = calculateTotal();
    console.log('total amount is ', totalAmount, 'subtotal is', calculateSubtotal())
    const products = newCartItems.map((item) => ({
      productId: item?.variations?.productId?._id,
      variantId: item?.variations?._id,
      specialPrice: item?.variations?.special_price,
      quantity: item?.quantity,
      totalAmount: item?.variations?.special_price * item?.quantity,
    }));

// Calculate coupon discount
  const couponDiscount = appliedDiscount >= calculateSubtotal() 
    ? calculateSubtotal() 
    : appliedDiscount;

     // Calculate online payment discount
    const onlineDiscount = calculateOnlineDiscount();
    
    let orderPayload = {
    additionalDiscount: onlineDiscount,
      discount:
        appliedDiscount >= calculateSubtotal()
          ? calculateSubtotal()
          : appliedDiscount,
      amount: totalAmount,
      products,
      shippingAddress: guest ? "" : shippingAddress?._id,
      billingAddress: guest ? "" : (isSameAsShipping ? shippingAddress._id : billingAddresslg),
      userId: UserInfo?._id,
      addressData: addressData1,
      userType: guest ? "guest" : "registered",
      discountCode,
      paymentMethod,
      // token: reCaptchToken,
    };

    const removeEmptyFields = (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );
    };
    // Remove empty, null, or undefined fields
    orderPayload = removeEmptyFields(orderPayload) as {
     discount: number;
    onlineDiscount: number;
      amount: number;
      products: {
        productId: any;
        variantId: any;
        specialPrice: any;
        quantity: number | undefined;
        totalAmount: number;
      }[];
      shippingAddress: any;
      billingAddress: any;
      userId: any;
      addressData: {};
      userType: string;
      discountDetails: {
      couponDiscount: number;
      additionalDiscount: number;
    };
    };
    try {
      const resultAction = await dispatch(createOrder(orderPayload));
      console.log('result action dara',resultAction)
      if (!resultAction?.payload?.success) {
        setLoading(false);
        toast.error(resultAction?.payload?.message??"Order creation failed!");
        return;
      }

      const orderId = resultAction?.payload?.order?._id;
      const usernamed = UserInfo?.name;
      const useremail = UserInfo?.email;
      const userphone = shippingAddress.phone;
      const razorpayOrder = resultAction.payload?.razorpayOrder;

      if (totalAmount > 0 && paymentMethod === "online") {
        // Proceed with Razorpay payment
        handleRazorpayPayment(
          razorpayOrder.id,
          orderId,
          useremail,
          usernamed,
          userphone
        );
      } else if (resultAction?.payload?.success) {
        toast.success("Order created successfully");
        setLoading(false);
        if (!uniqueId && !buynow) {
          dispatch(clearCart());
        }
        router.push("/order-success");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred while creating your order");
      console.error("Order creation error:", error);
    }
  };

  const handleRazorpayPayment = async (
    razorpayOrderId: any,
    orderId: any,
    useremail: any,
    usernamed: any,
    userphone: any
  ) => {
    setLoading(false);

    const totalAmount = calculateTotal();
    if (totalAmount <= 0) {
      toast.error("Total amount is zero. Cannot proceed with payment.");
      setLoading(false);
      return;
    }

    try {
      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh the page.");
        return;
      }

      if (razorpayOrderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: totalAmount * 100,
          currency: "INR",
          order_id: razorpayOrderId,
          description: "Payment for your order",

          handler: async (response: any) => {
            const payloadData = {
              ...response,
              orderId,
            };
            // Verify Payment on Backend
            const verifyResponse = await dispatch(verifyPayment(payloadData));
            if (verifyResponse?.payload?.data?.success) {
              toast.success("Payment successful!");
              if (!uniqueId && !buynow) {
                dispatch(clearCart());
              }
              router.push("/order-success");
            } else {
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: usernamed,
            email: useremail,
            contact: userphone,
          },
          theme: {
            color: "#000000",
          },
          // Handle case when user closes payment modal
          onClose: async () => {
            // Update order status to "failed"
            await dispatch(
              updateOrder({
                orderId,
                transactionId: "",
                status: "failed",
              })
            );
            setLoading(false);
            toast.error("Payment was not completed. Order marked as failed.");
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        toast.error("Failed to create Razorpay order, please try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Payment failed, please try again.");
      setLoading(false);
    }
  };

  const handleChangeAddress = () => {
    setOpen(true);
  };

  const handleAddressForm = () => {
    setOpen1(true);
  };

  const handleCheckboxChange = () => {
    const newValue = !isSameAsShipping;

    setIsSameAsCheckBox(true);
    setIsSameAsShipping(newValue);

    try {
      if (!newValue) {
        // If not same as shipping
        setIsPopupOpen(true);

        localStorage.setItem("billingaddressstatus", "true");
      } else {
        localStorage.removeItem("billingaddress");
        localStorage.removeItem("billingaddressstatus");
      }
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };


  //for  guest form data
  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      setFormErrors(prev =>
        ({ ...prev, firstname: "Name is required" }))
      setLoading(false)
      return false
    }

    if (name.length < 2) {
      setFormErrors(prev =>
        ({ ...prev, firstname: "Name must be at least 2 characters" }))
      setLoading(false)

      return false
    }

    setFormErrors(prev => ({ ...prev, firstname: "" }))
    return true
  }
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setFormErrors(prev =>
        ({ ...prev, email: "Email is required" }))
      setLoading(false)

      return false
    }

    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormErrors(prev => ({ ...prev, email: "Invalid email format" }));
      setLoading(false)

      return false;
    }
    if (email.includes(" ")) {
      setFormErrors(prev =>
        ({ ...prev, email: "Email cannot contain spaces" }))
      setLoading(false)

      return false
    }


    setFormErrors(prev => ({ ...prev, email: "" }))
    return true
  }


  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      setFormErrors(prev => ({ ...prev, phone: "Phone is Required" }))
      setLoading(false)

      return false
    }

    // Basic phone validation (allows various formats)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    if (!phoneRegex.test(phone)) {
      setFormErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }))
      setLoading(false)

      return false
    }

    setFormErrors(prev => ({ ...prev, phone: "" }))
    return true
  }

  const validateAddress = (address) => {
    if (!address.trim()) {
      setFormErrors(prev => ({ ...prev, address1: "Address is required" }))
      setLoading(false)

      return false
    }

    if (address.length < 5) {
      setFormErrors(prev => ({ ...prev, address1: "Please enter a complete address" }))
      setLoading(false)

      return false
    }

    setFormErrors(prev => ({ ...prev, address1: "" }))
    return true
  }

  const validateCountryState = () => {
    let isValid = true


    if (!idformdata.state_id) {
      setFormErrors(prev => ({ ...prev, state: "Please select a state" }))
      setLoading(false)

      isValid = false
    } else {
      setFormErrors(prev => ({ ...prev, state: "" }))
    }

    return isValid
  }
  const validatePinCode = (pinCode: string) => {
    if (!pinCode.trim()) {
      setFormErrors(prev => ({ ...prev, pinCode: "Pin Code is required" }))
      setLoading(false)

      return false
    }
    if (pinCode.includes(" ")) {
      setFormErrors(prev => ({ ...prev, pinCode: "Pin Code cannot contain spaces" }));
      setLoading(false)

      return false;
    }
    const pinCodeRegex = /^[0-9]{6}$/;
    if (!pinCodeRegex.test(pinCode)) {
      setFormErrors(prev => ({ ...prev, pinCode: "Pin Code must be exactly 6 digits" }));
      setLoading(false)

      return false;
    }
    setFormErrors(prev => ({ ...prev, pinCode: "" }))
    return true
  }
  const handleChange = (e: any): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });


    // Validate the field as the user types
    if (name === "firstname") validateFirstName(value)
    if (name === "email") validateEmail(value)
    if (name === "address1") validateAddress(value)
    if (name === "phone") validatePhone(value)
    if (name === "pinCode") validatePinCode(value)
  };

  return (
    <div className="relative flex flex-col md:flex-row font-Outfit mx-auto container">
      {guest ? (<div className="w-full md:w-1/2 flex flex-col px-4 md:px-10 item-center mx-auto  py-10">

        <form className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="">
              <label className="text-gray-700 font-medium block">Your Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className={`border ${formErrors.firstname ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.firstname && <p className="text-red-500 text-sm mt-1">{formErrors.firstname}</p>}
            </div>

            <div className=" hidden">
              <label className="text-gray-700 font-medium block">Last Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className={`border ${formErrors.lastname ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.lastname && <p className="text-red-500 text-sm mt-1">{formErrors.lastname}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="">
              <label className="text-gray-700 font-medium block">Phone<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
            </div>
            <div className="">
              <label className="text-gray-700 font-medium block">Email<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                className={`border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
          </div>

          <div className="">
            <label className="text-gray-700 font-medium block">Address Line 1<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className={`border ${formErrors.address1 ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
            />
            {formErrors.address1 && <p className="text-red-500 text-sm mt-1">{formErrors.address1}</p>}
          </div>

          <div className="">
            <label className="text-gray-700 font-medium block">Address Line 2</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className={`border ${formErrors.address2 ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all`}
            />
            {formErrors.address2 && <p className="text-red-500 text-sm mt-1">{formErrors.address2}</p>}
          </div>


          {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
           
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="">
              <label className="text-gray-700 font-medium block">State<span className="text-red-500">*</span></label>
              <Select
                className={`text-gray-800 rounded-lg ${formErrors.state ? 'border-red-500' : ''}`}
                classNamePrefix="select"
                name="state"
                value={selectedOptions.state}
                options={StateListState?.data?.map((state: any) => ({
                  value: { stateid: state.id, state_id: state._id },
                  label: state.name,
                }))}
                onChange={(selected: any) => {
                  setSelectedOptions((prev) => ({
                    ...prev,
                    state: selected,
                  }))
                  setFormData((prev) => ({
                    ...prev,
                    state: selected?.value.state_id || "",
                  }))
                  setIdformdata((prev) => ({
                    ...prev,
                    state_id: selected?.value.state_id || "",
                  }))
                  // Clear error when a selection is made
                  setFormErrors(prev => ({ ...prev, state: "" }))
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
              {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
            </div>
            <div className="">
              <label className="text-gray-700 font-medium block">Postal/Zip Code<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
              />
              {formErrors.pinCode && <p className="text-red-500 text-sm mt-1">{formErrors.pinCode}</p>}
            </div>


          </div>

        </form>
      </div>
      ) : (

        <div className="w-full md:w-1/2 flex flex-col items-center py-10 px-4 md:px-8 lg:pl-24 lg:pr-12">
          <div className="w-full">
            {UserInfo?.token && (
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Shipping Address
              </h2>
            )}
            {addressData?.length === 0 ? (
              <div className="rounded flex justify-between items-center bg-slate-100 shadow-md p-3 border">
                <p className="text-black text-sm">
                  There is no Shipping Address!!
                </p>
                <button
                  className="text-white bg-red-600 p-1 text-sm px-3"
                  onClick={() => {
                    UserInfo === undefined
                      ? router.push("/login")
                      : setOpen1(true);
                  }}
                >
                  Add Now!
                </button>
              </div>
            ) : (
              <>
                {addressData?.filter((a: any) => a.isDefault === true).length === 0 ? <div className="rounded flex justify-between items-center bg-slate-100 shadow-md p-3 border">
                  <p className="text-black text-sm">
                    There is no Default Address!!
                  </p>
                  <button
                    onClick={handleChangeAddress}
                    className="border px-4 p-2 text-xs rounded-lg font-bold text-red-600 border-red-600"
                  >
                    CHANGE ADDRESS
                  </button>
                </div> : <>

                  {addressData?.filter((a: any) => a.isDefault === true)
                    .map((a: any) => (
                      <div
                        className="border border-slate-200 rounded-md flex p-4 justify-between items-center bg-red-100"
                        key={a._id}
                      >
                        <div>
                          <span className="text-gray-700 text-md">Deliver to:</span>
                          {"  "}
                          <span className="font-bold text-black">{`${a?.firstname} ${a?.lastname}`}</span>

                          <p className="text-sm my-1 text-gray-700">
                            Phone: {a?.phonecode} {a?.phone}
                          </p>
                          <p className="text-sm my-1 text-gray-700">{a?.address1}</p>
                          <p className="text-sm my-1 text-gray-700">{a?.address2}</p>
                          <p className="text-sm my-1 text-gray-700">
                            {a?.state?.name} {a?.country?.name} {a?.pincode}
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={handleChangeAddress}
                            className="border px-4 p-2 text-xs rounded-lg font-bold text-red-600 border-red-600"
                          >
                            CHANGE ADDRESS
                          </button>
                        </div>
                      </div>
                    ))}
                </>
                }
              </>
            )}
          </div>

          {/* Billing Address */}
          {addressData?.filter((a: any) => a.isDefault === true)?.length > 0 && (
            <div className="w-full mt-14">
              <h1 className="text-lg font-semibold mb-6 text-gray-800">
                Billing Address
              </h1>
              <div className="space-y-4">
                <div className="flex border border-gray-300 rounded-md py-3 px-2 gap-8">
                  <input
                    type="checkbox"
                    checked={isSameAsShipping || Object.keys(billingAddresslg).length == 0}
                    onChange={handleCheckboxChange}
                  />
                  <p className="text-gray-400">Same as Shipping Address</p>
                </div>
              </div>

              {/* Show form only when checkbox is unchecked */}
              {isClient &&
                Object.keys(billingAddresslg).length !== 0 &&
                !isSameAsShipping && (
                  <div className="my-4 border border-slate-200 rounded-md flex p-4 justify-between items-center bg-red-100">
                    <div>
                      <span className="text-gray-700 text-md">Deliver to:</span>
                      {"  "}
                      <span className="font-bold text-black">{`${billingAddresslg?.firstname} ${billingAddresslg?.lastname}`}</span>

                      <p className="text-sm my-1 text-gray-700">
                        Phone: {billingAddresslg?.phone}
                      </p>
                      <p className="text-sm my-1 text-gray-700">
                        {billingAddresslg?.address1}
                      </p>
                      <p className="text-sm my-1 text-gray-700">
                        {billingAddresslg?.address2}
                      </p>
                      <p className="text-sm my-1 text-gray-700">
                        {stateData?.name} {countryData?.name}{" "}
                        {billingAddresslg?.pincode}
                      </p>
                    </div>
                  </div>
                )}
              {!isSameAsShipping && (
                <AddressFormPopup
                  isOpen={isPopupOpen}
                  onClose={(x: any) => {
                    setIsPopupOpen(!isPopupOpen);
                    if (x === 0) {
                      setIsSameAsShipping(true);
                      try {
                        localStorage.removeItem("billingaddressstatus");
                      } catch (error) {
                        console.error("Error removing from localStorage:", error);
                      }
                    }
                  }}
                  isEditing={isEditing}
                  userId={UserInfo?._id}
                  Address={address}
                  isBilling={!isSameAsShipping}
                />
              )}
              <Link href="/shop" className="flex items-center gap-2 mt-5">
                <FaAngleLeft className="text-red-800 text-sm" />
                <p className="text-red-800 text-sm"> Shop more</p>
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="w-full md:w-1/2 bg-slate-50 py-10">
        <div className="">
          <div className="w-11/12 mx-auto px-4 bg-slate-50">
            {newCartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-around mb-4 border p-2 rounded"
              >
                <div className="w-full sm:w-1/4 mb-2 sm:mb-0">
                  <img
                    src={item?.item_img || "/placeholder.svg"}
                    alt={item?.variations?.productId?.name || "Product image"}
                    className="w-full h-auto rounded"
                  />
                </div>
                <div className="flex-grow w-full sm:w-1/2 flex flex-col sm:flex-row justify-between px-3 py-2">
                  <div>
                    <h2 className="font-medium text-gray-700">
                      {item?.variations?.productId?.name}
                    </h2>
                    {item?.variations?.values?.map((e: any) => (
                      <div className="flex" key={e._id}>
                        <span className="text-xs text-gray-500">
                          + {e?.short_name}
                        </span>
                        <span className="text-xs text-gray-500 px-1"> </span>
                      </div>
                    ))}
                    <p className="text-sm font-semibold text-gray-700">
                      ₹{item?.variations?.special_price}x {item.quantity}
                    </p>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-500 hover:text-red-700 text-lg py-1"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-1/6 h-auto sm:h-28 text-center sm:text-end py-2 flex items-center justify-end">
                  <p className="font-medium text-gray-700">
                    ₹{item?.variations?.special_price * item?.quantity}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t mt-4 pt-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Discount code or gift card"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-grow border rounded px-4 py-2 w-full sm:w-auto text-black"
                />
                {appliedDiscount > 0 ? (
                  <button
                    onClick={handleRemoveDiscount}
                    className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyDiscount}
                    className="bg-black text-white px-4 py-2 rounded w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Apply
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-700">Subtotal</p>
                  <p className="text-gray-400">₹{calculateSubtotal()}</p>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-gray-700">Discount</p>
                    <p className="text-green-600">
                      -₹
                      {appliedDiscount >= calculateSubtotal()
                        ? calculateSubtotal()
                        : appliedDiscount}
                    </p>
                  </div>
                )}
                {paymentMethod === 'online' && (
                  <div className="flex justify-between">
                    <p className="text-gray-700">Additional Discount (5%)</p>
                    <p className="text-green-600">
                      -₹{calculateOnlineDiscount()}
                    </p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-green-600">Free</p>
                </div>
               
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
                <p className="text-gray-700">Total</p>
                <p className="text-gray-400">₹{calculateTotal()}</p>
              </div>
            </div>
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online-payment"
                    name="payment-method"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mr-2"
                  />
                  <label htmlFor="online-payment" className="text-gray-700">
                    Pay Online (Get additional 5% discount)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod-payment"
                    name="payment-method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mr-2"
                  />
                  <label htmlFor="cod-payment" className="text-gray-700">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={createProductOrder}
              className="w-full bg-black text-white py-3 mt-6 rounded"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-4">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  Processing...
                </div>
              ) : (
                paymentMethod === 'online' ? "Pay Now" : "Place Order (Cash on Delivery)"
              )}
            </button>
          </div>
        </div>
      </div>
      <AddressesPopup
        userInfo={UserInfo}
        AddressInfo={addressData}
        open={open}
        close={() => setOpen(false)}
      />

      <AddressFormPopup
        isOpen={open1}
        isEditing={false}
        isBilling={false}
        onClose={() => setOpen1(false)}
        userId={UserInfo?._id}
        Address={null} // Pass a default value for Address

      />
    </div>
  );
};

export default CheckoutPage;
