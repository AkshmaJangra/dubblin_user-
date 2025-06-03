"use client";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { MdTimer } from "react-icons/md";
import { resendOtp, verifyOTP } from "../../lib/AllSlices/userauthSlice";
import { useAppDispatch } from "../../lib/hooks";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const VerifyreRegisterOtp = ({ data }) => {
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [reCaptchToken, setReCaptchToken] = useState<string | null>(null);
  const mobile = searchParams?.get("mobile");

  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setPhone(localStorage.getItem("phone"));
    setEmail(localStorage.getItem("email"));
    setPassword(localStorage.getItem("password"));
    setReCaptchToken(localStorage.getItem("reCaptchToken"));
  }, []);

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
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if available
    if (index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = ""; // Clear current digit
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus(); // Move focus back
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const otpString = otp.join("");
    if (otpString.length < 4) {
      toast.error("Otp required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await dispatch(
        verifyOTP({
          otp: otpString,
          phone: phone,
        })
      ).unwrap();

      // Validate email and password before signing in
      if (!email || !password) {
        throw new Error("Email or password is missing.");
      }

      // Automatically log in the user after OTP verification
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        token: reCaptchToken,
      });


      if (!result?.error) {
        router.push("/"); // Redirect to the home page
      } else {
        toast.error("Sign-in failed. Please check your credentials.");
      }
    } catch (error: any) {
      toast.error(error.message ?? "An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    // setTimer(30);
    // setShowResend(false);
    const email = localStorage.getItem("email");
    dispatch(resendOtp(email));
  };

  return (
    <div className="min-h-screen border font-Outfit p-4">
      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-20 mt-8 md:mt-16">
        <div className="relative w-full max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-2xl hidden md:block lg:block">
          <Image
            src={data.backgroundImage}
            width={500}
            height={500}
            alt="Login"
            className="w-full h-auto object-cover "
          />

          <div className="absolute  flex flex-col justify-between p-4">
            <h1 className="text-white text-center font-bold text-md md:text-lg">
              {data.title}
            </h1>
            <p className="text-white text-center text-md md:text-lg font-light">
              {data.description}
            </p>
          </div>
        </div>

        <div className="max-w-md font-Outfit text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow-xl">
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-1 text-black">
              OTP Verification
            </h1>
            <p className="text-[15px] text-slate-500">
              Enter the 4-digit verification code that was sent to your Email
              Id.
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
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin text-white"
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
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>

          {/* <div className="text-sm text-slate-500 mt-4">
            Didn't receive code?{" "}
            <button
              className="font-medium text-indigo-500 hover:text-indigo-600"
              onClick={handleResendOTP}
              // disabled={!showResend}
            >
              Resend
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VerifyreRegisterOtp;
