"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from 'next/router';
import Link from "next/link";

export default function Popup({ onClose }: { onClose: () => void }) {


  const handleClose = () => {
    // Call the onClose function passed from parent
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-md bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#AA0A30] text-white px-4 py-2">
          <p className="text-sm font-medium">Shop Smart. Save Bigger. Move Faster</p>
          <button onClick={handleClose} className="text-white hover:text-white/80">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
          <p className="text-gray-800 text-sm">
            Enjoy free shipping, exclusive deals, and an extra</p>
            <h2 className="text-3xl font-light text-gray-600">
              <span className="text-[#AA0A30] ">10% OFF</span><br/><span className=" text-sm text-gray-700"> on all orders ₹3000 and above</span>
            </h2>
            <p className="text-gray-800 text-sm">
              Your essentials — elevated, simplified, and styled.
              </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
            </div>
            <Link href="/shop">
            <button 
             className="w-full bg-[#AA0A30] text-white py-3 font-medium text-sm hover:bg-[#601929] transition-colors">
              START MY HAUL
            </button>
            </Link>
            <div className="text-center">
              <p onClick={handleClose} className="text-xs text-gray-500 hover:underline">
              Skipping for now — but not for long!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
