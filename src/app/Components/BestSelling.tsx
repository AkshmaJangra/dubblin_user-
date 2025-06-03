"use client";

import Image from "next/image";
import Link from "next/link";

const BestSelling = ({ salesData }: { salesData: any }) => {
  const data = salesData?.SalesData;

  return (
    <div className="w-full py-8 font-Outfit container mx-auto px-4">
      {/* Optional heading section - uncomment if needed */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-black font-semibold font-Cinzel tracking-wider relative inline-block">
          {data?.main_heading}
          Best Selling
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-pink-600"></span>
        </h2>
        <p className="text-base md:text-lg font-medium text-black mt-2">
          {/* {data?.main_description} */}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {/* Left column - Full width on small screens */}
        <Link
          href={data?.left_image_link || "#"}
          className="col-span-1 md:col-span-1 lg:col-span-2 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={data?.left_image}
              alt="Left"
              fill
              className="object-cover"
              priority
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-30 z-0" /> */}

            <div className="absolute" />
            <div className="absolute bottom-0 left-3 md:bottom-6 md:left-6 text-white">
              <h2 className="text-2xl font-semibold text-red-800 uppercase font-Outfit">
                {/* {data?.left_image_title} */}
                Built to Cheers
              </h2>
              <p className="text-lg text-pink-300 font-medium mt-1">
                {/* {data?.left_image_description}
                 */}
              </p>
            </div>
          </div>
        </Link>

        {/* Middle column - Horizontal cards on small screens */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          {/* Small screens: horizontal layout */}
          <div className="flex flex-row md:flex-col gap-4">
            <Link
              href={data?.mid_upper_image_link || "#"}
              className="w-1/2 md:w-full transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative w-full h-48 md:h-72 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={data?.mid_upper_image}
                  alt="Mid Top"
                  fill
                  className="object-cover"
                />
                <div className="absolute" />
                <div className="absolute bottom-1 left-1 md:bottom-4 md:left-4 text-white">
                  <h2 className="text-base md:text-lg font-semibold text-red-800 uppercase font-Outfit">
                    {/* {data?.mid_upper_image_title} */}
                    Meal Gear
                  </h2>
                  {/* <p className="text-xs md:text-sm text-pink-300 font-medium mt-1">
                    {data?.mid_upper_image_description}
                    dubbling data
                  </p> */}
                </div>
              </div>
            </Link>

            <Link
              href={data?.mid_lower_image_link || "#"}
              className="w-1/2 md:w-full transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative w-full h-48 md:h-72 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={data?.mid_lower_image}
                  alt="Mid Bottom"
                  fill
                  className="object-cover"
                />
                <div className="absolute" />
                <div className="absolute bottom-1 left-1 md:bottom-4 md:left-4 text-white">
                  <h2 className="text-base md:text-lg font-semibold text-orange-100 uppercase font-Outfit">
                    {/* {data?.mid_lower_image_title} */}
                    Brew Blaze
                  </h2>
                  {/* <p className="text-xs md:text-sm text-pink-300 font-medium mt-1">
                    {data?.mid_lower_image_description}
                  </p> */}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right column - Full width on small screens */}
        <Link
          href={data?.right_image_link || "#"}
          className="col-span-1 md:col-span-1 lg:col-span-2 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={data?.right_image}
              alt="Right"
              fill
              className="object-cover"
            />
            <div className="absolute " />
            <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 text-white">
              <h2 className="text-2xl font-semibold  text-orange-100 uppercase font-Outfit">
                {/* {data?.right_image_title} */}
                Active Hydrate
              </h2>
              {/* <p className="text-lg text-pink-300 font-medium mt-1">
                {data?.right_image_description}
              </p> */}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BestSelling;
