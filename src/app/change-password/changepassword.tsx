"use client";
import React, { useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "../../lib/hooks";
import {
  changePassword,
  resetPassword,
} from "../../lib/AllSlices/userauthSlice";
import { Eye, EyeOff } from "lucide-react";
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
const ChangePassword: React.FC = ({ data }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_APP_SITE_KEY || "";

  const [capVal, setcapVal] = useState(null);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const email = localStorage.getItem("email");
  const phone = localStorage.getItem("phone");
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidation(validations);
    return Object.values(validations).every(Boolean);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    //Execute reCAPTCHA
    // const reCaptchToken = await window.grecaptcha.execute(SITE_KEY, {
    //   action: "login",
    // });
    // Validate password strength
    if (!validatePassword(newPassword)) {
      setError("Password does not meet all requirements");
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(
        changePassword({
          email,
          phone,
          newPassword,
          // token: reCaptchToken,
        })
      ).unwrap();

      // Redirect to login after successful password reset
      router.push("/login");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      setError("Failed to reset password. Please try again.");
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  return (
    <div className="min-h-screen font-Outfit p-4">
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 mt-8 md:mt-16">
        <div className="relative w-full max-w-md md:max-w-lg">
          <Image
            src={data?.backgroundImage}
            width={500}
            height={500}
            alt="Login"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <h1 className="text-white text-center font-bold text-lg md:text-xl">
              {data?.title}
            </h1>
            <p className="text-white text-center text-sm md:text-base">
              {data?.description}
            </p>
          </div>
        </div>
        <div className="w-full max-w-md border border-white p-4">
          <h1 className="text-black text-3xl md:text-4xl mb-6">
            Update Password
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
                  placeholder="New Password*"
                  required
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password validation indicators */}
              <div className="mt-2 text-xs">
                <p
                  className={
                    passwordValidation.length
                      ? "text-green-500"
                      : "text-gray-500"
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
                    passwordValidation.number
                      ? "text-green-500"
                      : "text-gray-500"
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-all text-black"
                  placeholder="Confirm Password*"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-red-500 text-xs">Passwords do not match</p>
                )}
            </div>
            <div className="my-5 flex items-center flex justify-center mb-2">
              {/* <ReCAPTCHA
                sitekey={SITE_KEY}
                onChange={(val) => setcapVal(val)}
              /> */}
            </div>
            <button
              type="submit"
              className="bg-black rounded-md text-white w-full 2 h-10 mb-4"
              disabled={isLoading}
            >
              {isLoading ? "Submitting...." : "Reset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
export const dynamic = "force-dynamic";
