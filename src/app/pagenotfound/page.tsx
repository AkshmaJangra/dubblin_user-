import React from "react";
import { ShoppingBag, ArrowLeft, Search, Home } from "lucide-react";

function PageNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-50 rounded-full -ml-32 -mb-32" />

        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            {/* Left side - Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
                Oops!
              </h1>
              <p className="text-2xl md:text-3xl text-purple-600 font-semibold mb-6">
                Page Not Found
              </p>
              <p className="text-gray-600 mb-8 max-w-md">
                The page you're looking for seems to have gone shopping
                elsewhere. Let's help you find what you're looking for.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </a>
                {/* <button
                  //   onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </button> */}
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <div className="w-48 h-48 bg-purple-100 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
                <ShoppingBag className="w-32 h-32 text-purple-600 relative z-10 animate-float" />
                {/* Decorative dots */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-pink-400"
                    style={{
                      top: `${Math.sin(i * (Math.PI / 3)) * 100 + 50}%`,
                      left: `${Math.cos(i * (Math.PI / 3)) * 100 + 50}%`,
                      opacity: 0.2 + i * 0.1,
                      animation: `pulse ${2 + i}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PageNotFound;
