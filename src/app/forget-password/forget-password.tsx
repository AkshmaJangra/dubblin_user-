"use client";
import React, { useState } from "react";
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
import Image from "next/image";
import { useAppDispatch } from "../../lib/hooks";
import { forgotPassword } from "../../lib/AllSlices/userauthSlice";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

const ForgetPassword: React.FC = ({ data }) => {
  const dispatch = useAppDispatch();
  let SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_APP_SITE_KEY || "";

  const [capVal, setcapVal] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("email", formData.email);
    localStorage.setItem("phone", formData.mobile);
    //Execute reCAPTCHA
    const reCaptchToken = await window.grecaptcha.execute(SITE_KEY, {
      action: "login",
    });
    // Validate inputs
    if (!formData.email && !formData.mobile) {
      setError("Please provide either email or mobile number");
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsLoading(true);

      await dispatch(
        forgotPassword({
          email: formData.email,
          mobile: formData.mobile,
          token: reCaptchToken,
        })
      ).unwrap();

      router.push(`/forget-password-verify`);
      // Handle success - you might want to show a success message or redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-Outfit p-4">
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

        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-black text-3xl md:text-4xl mb-6 font-semibold">
            Forget Password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Email"
              />
              <div className="text-center text-gray-500">or</div>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-slate-950"
                placeholder="Mobile number"
                maxLength={10}
              />
            </div>
            {/* <div className="my-5 flex items-center flex justify-center mb-2">
              <ReCAPTCHA
                sitekey={SITE_KEY}
                onChange={(val) => setcapVal(val)}
              />
            </div> */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              disabled={isLoading} // Disable if loading or captcha not checked
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
