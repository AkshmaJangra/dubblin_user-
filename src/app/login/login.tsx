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
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = ({ data }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the callbackUrl from URL parameters or default to home page
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  let SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_APP_SITE_KEY || "";

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goBack = () => {
    router.back();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setIsLoading(false);
      return;
    }

    try {
      //Execute reCAPTCHA
      const reCaptchToken = await window.grecaptcha.execute(SITE_KEY, {
        action: "login",
      });

      //Proceed with login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        token: reCaptchToken,
      });
      if (result?.error) {
        setIsLoading(false);
        setError("Invalid credentials");
      } else {
        toast.success("Login successful");
        setIsLoading(false);
        // Redirect to the callback URL after successful login
        router.push(callbackUrl);
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred during login");
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      // Pass the callbackUrl to the social login provider
      await signIn(provider, { callbackUrl });
    } catch (error) {
      setError(`Error signing in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 font-Outfit p-4">
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 mt-8 md:mt-16 max-w-6xl mx-auto">
        <div className="relative w-full max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-2xl hidden md:block lg:block">
          <Image
            src={data.backgroundImage}
            width={500}
            height={500}
            alt="Login"
            className="w-full h-auto object-cover "
          />

          <div className="absolute flex flex-col justify-between p-4">
            <h1 className="text-white text-center font-bold text-md md:text-lg">
              {data.title}
            </h1>
            <p className="text-white text-center text-md md:text-lg font-light">
              {data.description}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-black text-3xl md:text-4xl font-bold mb-6">
            Login
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  emailError ? "border-red-500" : "border-gray-200"
                } focus:border-black focus:ring-1 focus:ring-black transition-all text-black`}
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
              />
              {emailError && (
                <p className="text-red-500 text-xs">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                    passwordError ? "border-red-500" : "border-gray-200"
                  } focus:border-black focus:ring-1 focus:ring-black transition-all text-black pr-12`}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* <input
                  type="checkbox"
                  id="rememberme"
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label
                  htmlFor="rememberme"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember Me
                </label> */}
              </div>
              <a
                href="/forget-password"
                className="text-sm font-medium text-pink-700 hover:text-pink-800"
              >
                Forget password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">Or continue with</span>
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
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-black font-semibold hover:underline"
              >
                Create new one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
export const dynamic = "force-dynamic";
