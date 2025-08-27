"use client";
import React, { useState, useEffect, JSX, use } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
 
  fetchStateById,
  fetchStateList,
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
import { json as streamJson } from "stream/consumers";
// import { colourOptions } from '../data';

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
  email?: any;
}

interface UserInfoProps {
  UserInfo: any;
}


const CheckoutPage: React.FC<UserInfoProps> = (props) => {
  const { UserInfo } = props;

  const [open, setOpen] = useState(false);

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((store: RootState) => store?.cart?.items);
  
  const {  StateListState } = useSelector(
    (state: RootState) => state.shippingAddress
  );
 

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [newCartItems, setNewCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  const searchParams = useSearchParams(); // Dynamically get URL params
 
  // Initialize state that depends on localStorage only after component mounts
  
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
      } else {
        setNewCartItems([]);
      }

    });
  }, [buynow, uniqueId, cart, router, dispatch]);

 


  const [discountCode, setDiscountCode] = useState<string | null>("" as string);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [open1, setOpen1] = useState(false);
  const [loading, setLoading] = useState(false);

   const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    address1: "",
    address2: "",
    address3: "",
    apartment: "",
    state: "",
    pinCode: "",
    phone: "",
     userid: UserInfo?._id,
    email:''
  });
console.log(
  'form daat 1',formData
  )
  
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
  
const [idformdata, setIdformdata] = useState(() => {
   
    return {
    
      state_id: "",
    };
});
  console.log('idfrom data...',idformdata)
 const [selectedOptions, setSelectedOptions] = useState({
   
    state:  null,
  });
 



   useEffect(() => {
    
    dispatch(fetchStateList());
   }, [dispatch]);
  
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

  // if (!isClient) {
  //   // Return a simple loading state or skeleton UI when rendering on the server
  //   return (
  //     <div className="flex items-center justify-center h-screen text-slate-950">
  //       <p>Loading checkout...</p>
  //     </div>
  //   );
  // }


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

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const finalAmount =
      subtotal - appliedDiscount < 0 ? 0 : subtotal - appliedDiscount;
    return finalAmount;
  };

  const createProductOrder = async () => {
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
 const addressData= JSON.stringify({
      ...formData,
      state: idformdata.state_id,
    });
    console.log('addressData.....',addressData)
    setLoading(true);
    const totalAmount = calculateTotal()

    const products = newCartItems.map((item) => ({
      productId: item?.variations?.productId?._id,
      variantId: item?.variations?._id,
      specialPrice: item?.variations?.special_price,
      quantity: item?.quantity,
      totalAmount: item?.variations?.special_price * item?.quantity,
    }));

   
    const orderPayload = {
      discount:
        appliedDiscount >= calculateSubtotal()
          ? calculateSubtotal()
          : appliedDiscount,
      amount: totalAmount,
      products,
     addressData,
      userId: UserInfo?._id||'guest',
    };

    try {
      const resultAction = await dispatch(createOrder(orderPayload));
      if (!resultAction?.payload?.success) {
        setLoading(false);
        toast.error("Order creation failed!");
        return;
      }

      const orderId = resultAction?.payload?.order?._id;
      const usernamed = UserInfo?.name;
      const useremail = UserInfo?.email;
      const razorpayOrder = resultAction.payload?.razorpayOrder;

      if (totalAmount > 0) {
        handleRazorpayPayment(
          razorpayOrder.id,
          orderId,
          useremail,
          usernamed,
          phone
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
  // Validation functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      setFormErrors(prev =>
        ({ ...prev, firstname: "Name is required" }))
      return false
    }

    if (name.length < 2) {
      setFormErrors(prev =>
        ({ ...prev, firstname: "Name must be at least 2 characters" }))
      return false
    }

    // if (name.includes(" ")) {
    //   setFormErrors(prev =>
    //     ({ ...prev, firstname: "First name cannot contain spaces" }))
    //   return false
    // }

    // if (!/^[a-zA-Z'-]+$/.test(name)) {
    //   setFormErrors(prev => ({ ...prev, firstname: "First name can only contain letters, hyphens and apostrophes" }))
    //   return false
    // }

    setFormErrors(prev => ({ ...prev, firstname: "" }))
    return true
  }
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setFormErrors(prev =>
        ({ ...prev, email: "Email is required" }))
      return false
    }

    // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setFormErrors(prev => ({ ...prev, email: "Invalid email format" }));
    return false;
  }
    if (email.includes(" ")) {
      setFormErrors(prev =>
        ({ ...prev, email: "Email cannot contain spaces" }))
      return false
    }


    setFormErrors(prev => ({ ...prev, email: "" }))
    return true
  }

  // const validateLastName = (name: string) => {
  //   if (!name.trim()) {
  //     setFormErrors(prev => ({ ...prev, lastname: "Last name is required" }))
  //     return false
  //   }

  //   if (name.trim().length < 2) {
  //     setFormErrors(prev => ({ ...prev, lastname: "Last name must be at least 2 characters" }))
  //     return false
  //   }

  

  //   if (!/^[a-zA-Z\s-']+$/.test(name)) {
  //     setFormErrors(prev => ({ ...prev, lastname: "Last name can only contain letters, spaces, hyphens and apostrophes" }))
  //     return false
  //   }

  //   setFormErrors(prev => ({ ...prev, lastname: "" }))
  //   return true
  // }

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      setFormErrors(prev => ({ ...prev, phone: "Phone is Required" }))
      return false
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

  const validateAddress = (address) => {
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


    if (!idformdata.state_id) {
      setFormErrors(prev => ({ ...prev, state: "Please select a state" }))
      isValid = false
    } else {
      setFormErrors(prev => ({ ...prev, state: "" }))
    }

    return isValid
  }
 const validatePinCode = (pinCode: string) => {
    if (!pinCode.trim()) {
      setFormErrors(prev => ({ ...prev, pinCode: "Pin Code is required" }))
      return false
   }
    if (pinCode.includes(" ")) {
    setFormErrors(prev => ({ ...prev, pinCode: "Pin Code cannot contain spaces" }));
    return false;
  }
 const pinCodeRegex = /^[0-9]{6}$/;
  if (!pinCodeRegex.test(pinCode)) {
    setFormErrors(prev => ({ ...prev, pinCode: "Pin Code must be exactly 6 digits" }));
    return false;
  }
    setFormErrors(prev => ({ ...prev, pinCode: "" }))
    return true
  }

  console.log('form data here...',formData)
 const handleNewAddress = (): void => {
    // Validate all fields
    
    console.log('for, data is ....', formData)
   
  };
  return (
    <div className="relative flex flex-col md:flex-row font-Outfit mx-auto container">
      <div className="w-full md:w-1/2 flex flex-col items-center py-2 px-4 md:px-8 lg:pl-24 lg:pr-12">
       
         <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
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
                options={StateListState?.data?.map((state:any) => ({
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

      <div className="w-full md:w-1/2 bg-slate-50 py-10">
        <div className="">
          <div className="w-11/12 mx-auto px-6 bg-slate-50">
            {newCartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-around mb-4 border p-2 rounded"
              >
                <div className="w-full sm:w-1/4 mb-2 sm:mb-0">
                  <img
                    src={item?.item_img}
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
                    <p className="text-gray-400">
                      ₹
                      {appliedDiscount >= calculateSubtotal()
                        ? calculateSubtotal()
                        : appliedDiscount}
                    </p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-gray-400">Free</p>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
                <p className="text-gray-700">Total</p>
                <p className="text-gray-400">₹{calculateTotal()}</p>
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
                "Pay Now"
              )}
            </button>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default CheckoutPage;
