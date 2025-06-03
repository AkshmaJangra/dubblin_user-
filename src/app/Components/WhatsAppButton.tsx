"use client";
import React from "react";
import { BsWhatsapp } from "react-icons/bs";

const WhatsAppButton = () => {
  return (
    <div className="fixed left-4 bottom-4 z-50">
      {/* Pulse Ring */}
      <span className="absolute inline-flex h-14 w-14 rounded-full bg-green-500 opacity-75 animate-ping"></span>

      {/* WhatsApp Icon Button */}
      <a
        href="https://wa.me/917838388836" // Replace with your number
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center justify-center h-14 w-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition duration-300"
      >
        <BsWhatsapp className="w-6 h-6" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
