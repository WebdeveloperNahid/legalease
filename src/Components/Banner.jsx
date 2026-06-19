"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import {
  FaGavel,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

// Swiper এর কোর ও ইফেক্ট CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function Banner() {
  // Swiper ইনস্ট্যান্সকে ট্র্যাকিং করার জন্য স্টেট (ক্লিকিং ১০০% নিশ্চিত করবে)
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesData = [
    {
      id: 1,
      tag: "Verified Legal Experts",
      title: "Hire Top Professional Lawyers",
      highlight: "In Minutes",
      description:
        "Connect with certified, background-checked legal practitioners tailored to your specific corporate or personal legal needs.",
      imageUrl:
        "https://www.shutterstock.com/shutterstock/photos/2659622517/display_1500/stock-photo-handshake-after-consultation-between-male-lawyer-2659622517.jpg",
      btnText: "Find a Lawyer",
      btnLink: "/browse-lawyers",
    },
    {
      id: 2,
      tag: "AI-Powered Consultation",
      title: "Instant Legal Advice & Digital",
      highlight: "Consultation",
      description:
        "Get immediate insights on contract reviews, corporate laws, and litigation strategy from top legal minds via secure digital channels.",
      imageUrl:
        "https://www.shutterstock.com/shutterstock/photos/2280158911/display_1500/stock-photo-law-enforcement-officer-interrogating-criminals-male-2280158911.jpg",
      btnText: "Start Consultation",
      btnLink: "/consultation",
    },
    {
      id: 3,
      tag: "Secure Legal Infrastructure",
      title: "Smart Contracts & Shielded Execution",
      highlight: "Protocols",
      description:
        "Experience absolute transparency in legal retaining fees and automated documentation built with enterprise-grade security.",
      imageUrl:
        "https://www.shutterstock.com/shutterstock/photos/2499590819/display_1500/stock-vector-create-image-legal-scales-library-background-2499590819.jpg",
      btnText: "Explore Services",
      btnLink: "/services",
    },
  ];

  return (
    <div className="relative w-full bg-[#11100C] py-8 sm:py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative group/banner">
        {/* SWIPER CONTAINER */}
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false, // ক্লিক করার পরও অটো স্লাইড চালু থাকবে
          }}
          onSwiper={setSwiperInstance} // Swiper ইনস্ট্যান্স স্টেটে সেভ হচ্ছে
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // একটিভ ইনডেক্স ট্র্যাক
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          className="rounded-3xl border border-[#88865A]/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {slidesData.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full min-h-[550px] flex items-center px-6 py-16 md:px-20 md:py-24 overflow-hidden rounded-3xl">
                {/* 🌌 ব্যাকগ্রাউন্ড ইমেজ */}
                <div className="absolute inset-0 -z-10">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    priority={slide.id === 1}
                    className="object-cover transition-transform duration-1000 scale-100 group-hover/banner:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#11100C] via-[#14130C]/95 to-transparent opacity-95 md:opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11100C]/60 via-transparent to-transparent" />
                </div>

                {/* 📝 TEXT CONTENT */}
                <div className="max-w-2xl space-y-6 z-10 pr-4 sm:pr-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#88865A]/40 bg-[#242304]/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FFD500]">
                    <FaGavel className="text-xs" /> {slide.tag}
                  </div>

                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                    {slide.title}{" "}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD500] to-[#AF8752]">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="text-base leading-relaxed text-gray-300 sm:text-lg drop-shadow-md">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                      as={Link}
                      href={slide.btnLink}
                      radius="md"
                      className="h-12 bg-gradient-to-r from-[#FFD500] to-[#D4B200] px-8 text-sm font-bold text-black shadow-[0_4px_25px_rgba(255,213,0,0.25)] transition-all duration-300 hover:translate-y-[-2px]"
                      endContent={<FaArrowRight className="text-xs" />}
                    >
                      {slide.btnText}
                    </Button>

                    <Button
                      as={Link}
                      href="/about"
                      variant="bordered"
                      radius="md"
                      className="h-12 border-[#88865A]/60 bg-[#11100C]/40 backdrop-blur-md px-6 text-sm font-semibold text-gray-200 transition-all hover:bg-[#88865A]/20 hover:text-white"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                {/* 🎖️ ভেরিফাইড ব্যাজ */}
                <div className="absolute bottom-6 right-6 hidden sm:block bg-[#242304]/80 backdrop-blur-md border border-[#88865A]/40 px-3 py-1.5 rounded-md z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD500]">
                    LegalEase Security Verified
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 🎛️ ১০০% ওয়ার্কিং ম্যানুয়াল নেভিগেশন সিস্টেম */}
        {/* Left Arrow Button */}
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#88865A]/30 bg-[#242304]/80 text-[#88865A] backdrop-blur-md lg:opacity-0 lg:group-hover/banner:opacity-100 transition-all duration-300 hover:border-[#FFD500] hover:bg-[#242304]/90 hover:text-[#FFD500] focus:outline-none"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-xs sm:text-base" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#88865A]/30 bg-[#242304]/80 text-[#88865A] backdrop-blur-md lg:opacity-0 lg:group-hover/banner:opacity-100 transition-all duration-300 hover:border-[#FFD500] hover:bg-[#242304]/90 hover:text-[#FFD500] focus:outline-none"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-xs sm:text-base" />
        </button>

        {/* 🔘 ১০০% ওয়ার্কিং কাস্টম ডটস (PAGINATION) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-2.5">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperInstance?.slideToLoop(index)}
              className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                activeIndex === index
                  ? "w-6 bg-[#FFD500]"
                  : "w-2.5 bg-[#88865A]/50 hover:bg-[#88865A]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
