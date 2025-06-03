"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface AboutProps {
  aboutdata: any;
}

const About: React.FC<AboutProps> = ({ aboutdata }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const whoWeAreRef = useRef<HTMLDivElement>(null);
  const ourValuesRef = useRef<HTMLDivElement>(null);
  const finalImageRef = useRef<HTMLDivElement>(null);

  const dataArr = [
    {
      index: 1,
      heading: "Our Mission",
      description:
        " We believe in empowering a lifestyle shift where premium, reusable alternatives replace single-use plastics. Our mission is to make sustainability effortless—so that making the right choice isn’t a compromise but a natural way of life.",
      image: "/vision.png",
    },
    {
      index: 2,
      heading: "Our Motto",
      description:
        "Survival by Quality, Development by Innovation. At Dubblin, we combine cutting-edge technology, innovative designs, and an unwavering commitment to quality to bring you the best hydration and food storage solutions that inspire change.",
      image: "/moto.png",
    },
    {
      index: 3,
      heading: "Join the Movement",
      description:
        " With a robust PAN India distribution network, Dubblin is proud to be a leading name in vacuum steel bottles, borosilicate glassware, and stainless steel storage solutions. But our true achievement lies in the trust of our customers, who choose Dubblin not just as a product, but as a necessity.",
      image: "/movement.png",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="font-Outfit ">
      {/* Hero Section */}
      {/* <div
        ref={heroRef}
        className="h-[40vh] sm:h-[50vh] md:h-[60vh] bg-gray-900"
        style={{
          backgroundImage: `url(${aboutdata.topbanner_data.banner_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container h-full flex items-center">
          <div className="w-full md:w-1/2 ms-auto pe-10 text-center">
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-white uppercase">
              {aboutdata.topbanner_data.title}
            </h1>
          </div>
        </div>
      </div> */}

      <div>
        <img
          className="w-screen"
          src={aboutdata.topbanner_data.banner_image}
          alt="Banner Image"
        />
      </div>

      {/* Who We Are Section */}
      <section
        ref={whoWeAreRef}
        className="container mx-auto py-8 md:py-14 px-4 sm:px-6"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery Section */}
          <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Large image - Full width on xs, half width on sm+ */}
              <div className="w-full sm:w-[48%] mb-4 sm:mb-0">
                <img
                  src={aboutdata.intro_data.image1}
                  alt="Person with water bottle"
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>

              {/* Small images - Side by side on xs, stacked on sm+ */}
              <div className="w-full sm:w-[48%] flex flex-row sm:flex-col gap-4">
                <div className="w-[48%] sm:w-full">
                  <img
                    src={aboutdata.intro_data.image2}
                    alt="Person drinking water"
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                </div>
                <div className="w-[48%] sm:w-full">
                  <img
                    src={aboutdata.intro_data.image3}
                    alt="Person drinking water"
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-2/5 lg:pl-6">
            <div className="max-w-lg">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 md:mb-6">
                {aboutdata.intro_data.heading}
              </h2>

              <div
                className="text-black text-base md:text-lg space-y-4"
                dangerouslySetInnerHTML={{
                  __html: aboutdata.intro_data.description || "",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section
        ref={ourValuesRef}
        className="container mx-auto flex flex-col md:flex-row px-4 mt-8 md:mt-14"
      >
        <div className="w-full flex flex-wrap gap-4 justify-evenly">
          {dataArr.map((value, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                style={{ maxWidth: "350px" }}
              >
                <div
                  className="relative overflow-hidden flex justify-center"
                  style={{ height: "200px" }}
                >
                  <img
                    src={value?.image || "/api/placeholder/350/200"}
                    alt={value?.heading || "Card image"}
                    className="h-full object-cover transition-transform duration-500 w-auto"
                    style={{
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300"
                    style={{ opacity: isHovered ? 0.6 : 0 }}
                  ></div>
                </div>

                <div className="p-6">
                  <h1 className="text-xl font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-blue-600">
                    {value?.heading || "Card Heading"}
                  </h1>

                  <p className="text-gray-600 text-sm">
                    {value?.description ||
                      "Card description goes here. Add details about this card item."}
                  </p>

                  <div
                    className="transition-all duration-300 mt-4 flex justify-end"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered
                        ? "translateY(0)"
                        : "translateY(10px)",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Image Section */}
      <section
        ref={finalImageRef}
        className="h-[60vh] sm:h-[70vh] md:h-[90vh] mt-8 md:mt-14"
        style={{
          backgroundImage: `url(${aboutdata?.bottombanner_data?.banner_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto flow-root">
          <div className="w-[95%] sm:w-[80%] md:w-[60%] lg:w-[37%] mt-8 sm:mt-12 md:mt-20 mx-auto md:ml-5 bg-white rounded-xl text-black space-y-4 p-6">
            <h1 className="text-lg sm:text-xl font-semibold">
              {aboutdata?.bottombanner_data?.title}
            </h1>
            <div
              className="text-sm sm:text-base text-gray-900"
              dangerouslySetInnerHTML={{
                __html: aboutdata?.bottombanner_data?.description || "",
              }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
