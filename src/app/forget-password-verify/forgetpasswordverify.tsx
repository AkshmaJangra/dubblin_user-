"use client";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { MdTimer } from "react-icons/md";
import {
  resendOtp,
  verifyRegisteredUserOTP,
} from "../../lib/AllSlices/userauthSlice";
import { useAppDispatch } from "../../lib/hooks";
import { toast } from "sonner";

const ForgetPasswordVerify = ({ data }) => {
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = localStorage.getItem("email") || "";
  const mobile = localStorage.getItem("phone") || "";
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setShowResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      setIsLoading(false);
      return;
    }
    dispatch(
      verifyRegisteredUserOTP({
        mobile: mobile!,
        email: email!,
        otp: enteredOtp,
      })
    )
      .unwrap()
      .then(() => {
        router.push("/change-password");
      })
      .catch((error) => {
        toast.error("Verification failed. Please try again.");
        setIsLoading(false);
      });
  };

  const handleResendOTP = () => {
    setTimer(30);
    setShowResend(false);

    dispatch(resendOtp(email));

    toast.success("OTP resent successfully.");
  };

  const handleBackspace = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      // If the current field has a value, clear it
      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      }
      // If it's already empty, move focus to the previous field
      else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen border font-Outfit p-4">
      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-20 mt-8 md:mt-16">
        <div className="relative w-full max-w-md md:max-w-lg hidden md:block lg:block">
          <Image
            src={data?.backgroundImage}
            width={500}
            height={500}
            layout="responsive"
            alt="Login"
          />
        </div>

        <div className="max-w-md font-Outfit text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow-xl">
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-1 text-black">
              OTP Verification
            </h1>
            <p className="text-[15px] text-slate-500">
              Enter the 4-digit verification code sent to your email.
            </p>
          </header>
          <form onSubmit={handleVerify} className="flex flex-col items-center">
            <div className="flex gap-2 my-3">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-black px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black-800 focus:outline-none focus:ring focus:ring-indigo-300 transition-colors duration-150"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <div className="text-sm text-slate-500 mt-4">
            {showResend ? (
              <button
                className="font-medium text-indigo-500 hover:text-indigo-600"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            ) : (
              <p className="flex items-center justify-center gap-2">
                <MdTimer className="text-gray-500" /> {timer}s remaining
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordVerify;
export const dynamic = "force-dynamic";
