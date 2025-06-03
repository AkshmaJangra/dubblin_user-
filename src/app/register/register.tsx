"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../lib/hooks";
import { toast } from "sonner";
import Link from "next/link";
import {
  registerUser,
  updateInputChanges,
} from "../../lib/AllSlices/userauthSlice";
import { Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import { signIn } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";
// Extend the Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}
const Register: React.FC = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [capVal, setcapVal] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  let SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_APP_SITE_KEY || "";

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    last_name: "",
    phone: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newvalue = type === "checkbox" ? checked : value;

    // Prevent spaces in name, last_name, and email fields
    if (
      (name === "name" || name === "last_name" || name === "email") &&
      /\s/.test(value)
    ) {
      return;
    }

    if (name === "email" && value.includes(" ")) {
      toast.error("Email cannot contain spaces");
      return;
    }

    setformdata({
      ...formdata,
      [name]: newvalue,
    });

    if (name === "email") {
      const validationMsg = document.getElementById("emailValidation");
      if (value.includes("@") && value.includes(".")) {
        if (validationMsg) {
          validationMsg.innerHTML = "Email is valid";
          validationMsg.style.color = "green";
        }
      } else {
        if (validationMsg) {
          validationMsg.innerHTML = "Email is not valid";
          validationMsg.style.color = "red";
        }
      }
    }

    if (name === "password") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }

    if (name === "phone") {
      const validationMsg = document.getElementById("phoneValidation");
      if (/^\d{10}$/.test(value)) {
        if (validationMsg) {
          validationMsg.innerHTML = "Phone number is valid";
          validationMsg.style.color = "green";
        }
      } else {
        if (validationMsg) {
          validationMsg.innerHTML = "Phone number must be 10 digits";
          validationMsg.style.color = "red";
        }
      }
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(value === formdata.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setIsLoading(true); // Start loader

    try {
      // Execute reCAPTCHA
      const reCaptchToken = await window.grecaptcha.execute(SITE_KEY, {
        action: "register",
      });

      // Check if any field is empty
      const emptyFields: string[] = [];
      if (!formdata.name.trim()) emptyFields.push("First Name");
      if (!formdata.last_name.trim()) emptyFields.push("Last Name");
      if (!formdata.email.trim()) emptyFields.push("Email");
      if (!formdata.phone.trim()) emptyFields.push("Phone");
      if (!formdata.password.trim()) emptyFields.push("Password");
      if (!confirmPassword.trim()) emptyFields.push("Confirm Password");

      if (emptyFields.length > 0) {
        toast.error(
          `The following fields are required: ${emptyFields.join(", ")}`
        );
        setIsLoading(false); // Stop loader
        return;
      }

      // Check phone validation
      if (!/^\d{10}$/.test(formdata.phone)) {
        toast.error("Phone number must be 10 digits");
        setIsLoading(false); // Stop loader
        return;
      }

      // Check email validation
      if (!formdata.email.includes("@") || !formdata.email.includes(".")) {
        toast.error("Email is not valid");
        setIsLoading(false); // Stop loader
        return;
      }

      // Check password validations
      if (
        !passwordValidation.length ||
        !passwordValidation.uppercase ||
        !passwordValidation.lowercase ||
        !passwordValidation.number ||
        !passwordValidation.special
      ) {
        toast.error("Password does not meet the required criteria");
        setIsLoading(false); // Stop loader
        return;
      }

      if (!passwordMatch) {
        toast.error("Passwords do not match");
        setIsLoading(false); // Stop loader
        return;
      }

      if (formdata.password.length < 8) {
        toast.error("Password should be at least 8 characters");
        setIsLoading(false); // Stop loader
        return;
      }

      // Proceed with registration
      localStorage.setItem("phone", formdata.phone);
      localStorage.setItem("email", formdata.email);
      localStorage.setItem("password", formdata.password);
      localStorage.setItem("reCaptchToken", reCaptchToken);
      const response = await dispatch(
        registerUser({
          name: formdata.name,
          last_name: formdata.last_name,
          email: formdata.email,
          phone: formdata.phone,
          password: formdata.password,
          token: reCaptchToken,
        })
      ).unwrap();

      if (!response?.success) {
        toast.error(response?.message);
      } else {
        router.push(`/verify`);
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  function handleKeyDown(event: any) {
    const key = event.key;
    const inputField = event.target;
    const isEmpty = inputField.value.trim() === "";

    if (isEmpty && key === " ") {
      event.preventDefault();
    } else if (!isEmpty && key === " ") {
      event.stopPropagation();
    } else if (
      (key >= "0" && key <= "9") ||
      key === "Enter" ||
      (key >= 48 && key <= 57)
    ) {
      event.preventDefault();
    } else {
      const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharacters.test(key)) {
        event.preventDefault();
      }
    }
  }
  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      setError(`Error signing in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen border font-Outfit p-4">
      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-20 mt-4 md:mt-16">
        <div className="relative w-full max-w-md md:max-w-lg hidden md:block lg:block">
          <Image
            src={data.backgroundImage}
            width={500}
            height={500}
            layout="responsive"
            alt="Login"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <h1 className="text-white text-center font-bold text-lg md:text-xl">
              {data.title}
            </h1>
            <p className="text-black text-center text-sm md:text-base">
              {data.description}
            </p>
          </div>
        </div>
        <div className="w-full max-w-md border border-white space-y-4">
          <h1 className="text-black text-3xl md:text-4xl mb-6">
            Create Account
          </h1>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              First Name*
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
              placeholder="First name"
              required
              name="name"
              value={formdata.name}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Last Name*
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
              placeholder="Last name"
              required
              name="last_name"
              value={formdata.last_name}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
              placeholder="Enter your email"
              required
              name="email"
              value={formdata.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
                name="password"
                placeholder="Password*"
                value={formdata.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password validation indicators */}
            <div className="mt-2 text-xs">
              <p
                className={
                  passwordValidation.length ? "text-green-500" : "text-gray-500"
                }
              >
                ✓ At least 8 characters
              </p>
              <p
                className={
                  passwordValidation.uppercase
                    ? "text-green-500"
                    : "text-gray-500"
                }
              >
                ✓ At least one uppercase letter
              </p>
              <p
                className={
                  passwordValidation.lowercase
                    ? "text-green-500"
                    : "text-gray-500"
                }
              >
                ✓ At least one lowercase letter
              </p>
              <p
                className={
                  passwordValidation.number ? "text-green-500" : "text-gray-500"
                }
              >
                ✓ At least one number
              </p>
              <p
                className={
                  passwordValidation.special
                    ? "text-green-500"
                    : "text-gray-500"
                }
              >
                ✓ At least one special character
              </p>
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password*
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
              name="confirmPassword"
              placeholder="Confirm Password*"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pt-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {!passwordMatch && confirmPassword && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone*</label>
            <input
              type="phone"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
              name="phone"
              placeholder="Phone no.*"
              value={formdata.phone}
              onChange={handleInputChange}
              required
            />
            <div id="phoneValidation" className="text-xs mt-1"></div>
          </div>
          {/* <div className="my-5 flex items-center flex justify-center mb-2">
            <ReCAPTCHA sitekey={SITE_KEY} onChange={(val) => setcapVal(val)} />
          </div> */}
          <button
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            onClick={handleRegister}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Submitting..." : "Submit"} {/* Show loader text */}
          </button>

          <div className="my-5 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">Or register with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Image src="/google.png" width={20} height={20} alt="Google" />
              <span className="text-sm font-medium text-black">Google</span>
            </button>
            {/* <button
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Image
                src="/facebook.png"
                width={20}
                height={20}
                alt="Facebook"
              />
              <span className="text-sm font-medium text-black">Facebook</span>
            </button> */}
          </div>

          <div className="mt-5 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-black font-semibold hover:underline"
              >
                LogIn
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
export const dynamic = "force-dynamic";
