import { Cinzel } from 'next/font/google';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily:{
        Outfit: ["var(--font-Outfit)"],
        Cinzel: ["var(--font-Cinzel)"],
        Racing: ["var(--font-Racing)"],
      }
    },
  },
  plugins: [],
};
