// "use client";
// import React, { useEffect } from "react";
// import {
//   CheckCircle2,
//   Package,
//   Calendar,
//   MapPin,
//   ArrowUpRight,
//   CheckCircle,
//   Truck,
//   ArrowLeft,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// function OrderSuccess() {
//   const navigate = useRouter();

//   //   useEffect(() => {
//   //     const orderSuccess = localStorage.getItem("orderSuccess");
//   //     if (!orderSuccess) {
//   //       navigate.push("/"); // Redirect to home if the flag is not set
//   //     } else {
//   //       localStorage.removeItem("orderSuccess"); // Clear the flag after accessing the page
//   //     }
//   //   }, [navigate]);
//   const handlenavigate = () => {
//     navigate.push("/shop");
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
//       <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
//         {/* Header Section */}
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <CheckCircle className="w-16 h-16 text-green-500" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Order Successful!
//           </h1>
//           <p className="text-gray-600">
//             Thank you for your purchase. Your order has been confirmed.
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
//           <button
//             className="flex items-center text-gray-600 hover:text-gray-800 transition-colors pt-2"
//             onClick={() => handlenavigate()}
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Return to Shopping
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderSuccess;


"use client"
import { Package, Calendar, CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

function OrderSuccess() {
  const navigate = useRouter()

  //   useEffect(() => {
  //     const orderSuccess = localStorage.getItem("orderSuccess");
  //     if (!orderSuccess) {
  //       navigate.push("/"); // Redirect to home if the flag is not set
  //     } else {
  //       localStorage.removeItem("orderSuccess"); // Clear the flag after accessing the page
  //     }
  //   }, [navigate]);

  const handlenavigate = () => {
    navigate.push("/shop")
  }

  return (
    <div className="min-h-screen font-Outfit bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-16 flex items-center justify-center">
          <h2 className="text-white font-semibold text-lg">Order Confirmation</h2>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-green-100 p-5 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Successful!</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6"></div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors pt-2 group"
              onClick={() => handlenavigate()}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:text-green-500 transition-colors" />
              <span>Return to Shopping</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess
