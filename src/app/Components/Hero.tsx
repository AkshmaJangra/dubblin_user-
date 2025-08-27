"use client"
import type React from "react"
import { useEffect, useState, useRef, useMemo } from "react"
import gsap from "gsap"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define interfaces for banner data
interface Banner {
  banner_image?: string
  title?: string
  sequence?: string
  description?: string
  button_link?: string
  button_name?: string
  button?: boolean
}

// Define type for refs array
type SlideRef = React.RefObject<HTMLDivElement>
type TextRef = React.RefObject<HTMLDivElement>

const Hero: React.FC<{ slidersdata: Banner[] }> = ({ slidersdata: unsortedData }) => {
  // Sort the slides based on sequence number
  const slidersdata = useMemo(() => {
    return [...unsortedData].sort((a, b) => {
      const seqA = a.sequence ? Number.parseInt(a.sequence) : 0
      const seqB = b.sequence ? Number.parseInt(b.sequence) : 0
      return seqA - seqB
    })
  }, [unsortedData])

  const [currentSlide, setCurrentSlide] = useState<number>(0)
  // Create refs dynamically based on the number of slides
  const slideRefs = useRef<HTMLDivElement[]>([])
  const textRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    // Initial animation for the first slide
    animateSlide(0)

    // Set up automatic carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidersdata.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    animateSlide(currentSlide)
  }, [currentSlide])

  const animateSlide = (index: number): void => {
    // Reset all slides
    slideRefs.current.forEach((ref, i) => {
      if (ref) {
        gsap.set(ref, { opacity: i === index ? 1 : 0 })
      }
    })

    // Animate text elements
    if (textRefs[index]?.current) {
      const textElements = textRefs[index]?.current.children;
      gsap.fromTo(
        textElements,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        },
      )
    }
  }

  const handlePrevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slidersdata.length) % slidersdata.length)
  }

  const handleNextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slidersdata.length)
  }

  return (
   <>
      {/* Desktop and Tablet View */}
      <div className="relative h-[50vh] sm:h-[90vh] overflow-hidden hidden md:block">
        {slidersdata.map((banner, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image with Cover */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${banner?.banner_image})`,
                backgroundPosition: "10% 25%",
              }}
            />
            
            {/* Full Black Overlay */}
            <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50" />
            
            {/* Content */}
            <div
              ref={(el) => (textRefs.current[index] = el)}
              className={`relative z-10 px-2 md:px-20 lg:px-32 h-full container mx-auto flex flex-col justify-center font-Outfit text-white text-${
                banner?.alignment === "left" ? "left" : banner?.alignment === "center" ? "center" : "right"
              }`}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                {banner?.title}
                <span className="font-semibold text-1xl sm:text-4xl md:text-5xl lg:text-6xl block">
                  {banner?.highlight}
                </span>
              </h1>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl">
                {banner?.description}
              </p>
              {banner?.button && (
                <a href={banner?.button_link}>
                  <button className="bg-red-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg mt-3 sm:mt-4 md:mt-6 w-fit hover:bg-red-800 transition-colors duration-300 text-xs sm:text-sm md:text-base">
                    {banner?.button_name}
                  </button>
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-2 sm:left-4 z-40 top-1/2 transform -translate-y-1/2 text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-10 h-10 lg:w-20 lg:h-20" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-2 sm:right-4 z-40 top-1/2 transform -translate-y-1/2 text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-10 h-10 lg:w-20 lg:h-20" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2">
          {slidersdata.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white w-4 sm:w-6 md:w-8" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="relative h-[50vh] overflow-hidden block md:hidden">
        {slidersdata.map((banner, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className={`absolute inset-0 transition-opacity duration-500 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image with Cover */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${banner?.banner_image})`,
                backgroundPosition: "10% 25%",
              }}
            />
            
            {/* Full Black Overlay */}
            <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50" />
            
            {/* Content */}
            <div
              ref={(el) => (textRefs.current[index] = el)}
              className={`relative z-10 px-10 h-full flex flex-col justify-center font-Outfit text-white text-${
                banner?.alignment === "left" ? "left" : banner?.alignment === "center" ? "center" : "right"
              }`}
            >
              <h1 className="text-2xl">
                {banner?.title}
                <span className="font-semibold text-1xl block">
                  {banner?.highlight}
                </span>
              </h1>
              <p className="mt-2 text-sm">
                {banner?.description}
              </p>
              {banner?.button && (
                <a href={banner?.button_link}>
                  <button className="bg-red-700 px-3 py-1 rounded-lg mt-3 w-fit hover:bg-red-800 transition-colors duration-300 text-xs">
                    {banner?.button_name}
                  </button>
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-2 top-1/2 z-20 transform -translate-y-1/2 text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-2 top-1/2 z-20 transform -translate-y-1/2 text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {slidersdata.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white w-4" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Hero

