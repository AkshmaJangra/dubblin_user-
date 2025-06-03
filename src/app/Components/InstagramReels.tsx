"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import axios from "axios";
import { getReels } from "../../lib/repos/instagramReelsRepo";

const InstagramReels = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(7);
  const [instadata, setInstadata] = useState([]);
  const reelsRef = useRef(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(2);
      else if (width < 768) setVisibleCount(2);
      else if (width < 1024) setVisibleCount(3);
      else setVisibleCount(7);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    fetchInstagramData();
  }, []);

  const fetchInstagramData = async () => {
    try {
      const limit = 16;
      const allReels = await getReels();
      setInstadata(allReels?.data);
    } catch (error) {
      console.error("Error fetching Instagram data:", error);
    }
  };

  const videoReels = instadata?.filter((item) => item?.media_type === "VIDEO");

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 7);
      animateSlide("right");
    }
  };

  const handleNext = () => {
    if (startIndex < videoReels?.length - visibleCount) {
      setStartIndex((prev) => prev + 7);
      animateSlide("left");
    }
  };

  const animateSlide = (direction) => {
    if (reelsRef.current) {
      gsap.fromTo(
        reelsRef.current,
        { x: direction === "left" ? 0 : -20, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  };

  const visibleVideos = videoReels?.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <div className="relative max-w-7xl mx-auto px-4 ">
      <div
        ref={reelsRef}
        className="grid gap-4 grid-cols-2 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-8 "
        style={{
          gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
        }}
      >
        {visibleVideos?.map((video, index) => (
          // <div key={video.id} className="aspect-video relative">
          <video
            key={video.id}
            src={video.media_url}
            className="w-full h-full object-cover rounded-lg "
            autoPlay
            loop
            muted
            playsInline
            controls
          />
          // </div>
        ))}
      </div>

      {videoReels?.length > visibleCount && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-black p-2 rounded-full shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 z-10"
            onClick={handlePrev}
            disabled={startIndex === 0}
            aria-label="Previous videos"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-black p-2 rounded-full shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 z-10"
            onClick={handleNext}
            disabled={startIndex >= videoReels?.length - visibleCount}
            aria-label="Next videos"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default InstagramReels;
