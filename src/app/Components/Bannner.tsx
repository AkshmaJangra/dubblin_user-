"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface BannerProps {
  midbannerdata: any;
}

const Banner: React.FC<BannerProps> = (props) => {
  const { midbannerdata } = props;
  const bannerdata = midbannerdata?.MidBanner[0];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component is mounted on the client
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Ensure the component renders only on the client

  return (
    <div className="relative mt-12 overflow-hidden h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerdata?.image})`,
        }}
      />
      <Link href={bannerdata?.link}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white font-Outfit max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
              {bannerdata?.title}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide">
              {bannerdata?.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Banner;
