"use client";

import Banner from "@/Components/Banner";
import FeaturedLawyers from "@/Components/FeaturedLawyers";
import LegalCategories from "@/Components/Legalcategories";
import TopExperts from "@/Components/TopExperts";



export default function Home() {
  return (
    <div className="bg-[#fbfbf9] min-h-screen">
      {/* ১. ব্যানার সেকশন */}
      <Banner/>
      <FeaturedLawyers></FeaturedLawyers>

      {/* ২. আলাদা করা টপ এক্সপার্ট সেকশন (লজিক সব এর ভেতরেই রান হবে) */}
      <TopExperts />

      {/* ৩. লিগ্যাল ক্যাটাগরিস গ্রিড সেকশন */}
      <LegalCategories></LegalCategories>
    </div>
  );
}