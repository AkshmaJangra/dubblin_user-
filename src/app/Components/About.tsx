import React from "react";
import { getHomeAbout } from "../../lib/repos/homeabout";

const About: React.FC = async () => {
  const aboutData = await getHomeAbout();

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url(${aboutData[0][0]?.background_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container text-black font-Outfit mx-auto flex flex-wrap lg:flex-nowrap justify-around py-10">
        {/* Left Image Section */}
        <div className="w-full p-3 bg-white lg:w-2/6 flex justify-center mb-8 lg:mb-0">
          <img
            src={aboutData[0][0]?.main_image}
            className="w-full h-auto"
            alt="About image"
          />
        </div>

        {/* Right Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          {/* Info Section */}
          <div
            className="pb-24 px-5 lg:px-8"
            style={{
              backgroundImage: "url('/Whitebg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="space-y-6 mt-5">
              <h1 className="text-lg lg:text-2xl font-semibold">
                {aboutData[0][0].heading}
              </h1>
              {aboutData[1].map((list: any, index: any) => {
                return (
                  <p
                    key={index}
                    className="flex items-center gap-4 text-sm lg:text-xl "
                  >
                    <img
                      src={list.icon}
                      className="w-6 lg:w-8"
                      alt="Core feature icon"
                    />
                    {list?.title}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="flex justify-between mt-6 px-5 lg:px-0">
            <div className="flex flex-col items-center w-1/3">
              <div className="flex justify-center items-center bg-white p-3 lg:py-2 lg:px-2 w-16 h-16 lg:w-24 lg:h-24 rounded-full">
                <img
                  src={aboutData[0][0].icon1}
                  className="w-3/4"
                  alt="Feature icon"
                />
              </div>
              <p className="mt-2 lg:mt-4 text-xs lg:text-lg font-semibold text-center">
                {aboutData[0][0].title1}
              </p>
            </div>

            <div className="flex flex-col items-center w-1/3">
              <div className="flex justify-center items-center bg-white p-3 lg:py-2 lg:px-2 w-16 h-16 lg:w-24 lg:h-24 rounded-full">
                <img
                  src={aboutData[0][0]?.icon2}
                  className="w-3/4"
                  alt="Feature icon"
                />
              </div>
              <p className="mt-2 lg:mt-4 text-xs lg:text-lg font-semibold text-center">
                {aboutData[0][0].title2}
              </p>
            </div>

            <div className="flex flex-col items-center w-1/3">
              <div className="flex justify-center items-center bg-white p-3 lg:py-2 lg:px-2 w-16 h-16 lg:w-24 lg:h-24 rounded-full">
                <img
                  src={aboutData[0][0].icon3}
                  className="w-3/4"
                  alt="Feature icon"
                />
              </div>
              <p className="mt-2 lg:mt-4 text-xs lg:text-lg font-semibold text-center">
                {aboutData[0][0].title3}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
export const dynamic = "force-dynamic";
