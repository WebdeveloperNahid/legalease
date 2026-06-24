"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ExpertCard({ expert, index }) {
  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 } 
    },
  };

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.4, ease: "easeOut" } }}
      // ✅ এখানে স্পষ্ট ক্যাফে/অলিভ-বেইজ ব্যাকগ্রাউন্ড (#F1F2EB) ব্যবহার করা হয়েছে যা থিমের সাথে পারফেক্টলি ম্যাচ করবে
      // ✅ বর্ডার কালারকেও একটু ডিপ করা হয়েছে (#E1E3D5) যাতে কার্ডের শেপ স্পষ্ট আলাদা করা যায়
      className="bg-[#F1F2EB] border border-[#E1E3D5] rounded-2xl overflow-hidden flex flex-col justify-between shadow-[0_4px_15px_rgba(70,70,4,0.03)] hover:shadow-[0_20px_50px_rgba(70,70,4,0.12)] hover:border-[#464604]/40 transition-all duration-400 group relative w-full max-w-sm"
    >
      {/* র্যাঙ্কিং ব্যাজ */}
      <span className="absolute top-3.5 left-3.5 z-10 w-6 h-6 bg-[#042e21] text-white text-[10px] font-bold flex items-center justify-center rounded-md shadow-md">
        #{index + 1}
      </span>

      {/* ইমেজ সেকশন - ইমেজ ব্যাকগ্রাউন্ডকে একদম সাদা রাখা হয়েছে যাতে কনট্রাস্ট সুন্দর হয় */}
      <div className="relative w-full h-64 bg-white overflow-hidden border-b border-[#E1E3D5]">
        <img
          src={expert.image || "https://via.placeholder.com/400x500?text=Legal+Ease"}
          alt={expert.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3.5 right-3.5 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border shadow-sm text-[#464604] border-[#E1E3D5]">
          • Top Elite
        </span>
      </div>

      {/* কন্টেন্ট বডি */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-2">
          {/* স্পেশালিটি */}
          <p className="text-[10px] text-[#464604] font-extrabold tracking-widest uppercase">
            {expert.specialty || "General"} Legal Specialist
          </p>
          {/* নাম */}
          <h3 className="font-serif font-bold text-slate-950 text-lg tracking-tight leading-tight group-hover:text-[#464604] transition-colors duration-300">
            {expert.name}
          </h3>
          <p className="text-xs text-slate-600 font-normal mt-1">Senior Counsel & Partner</p>
        </div>

        {/* ফি ডিসপ্লে - বর্ডার কালার ম্যাচ করা হয়েছে */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E1E3D5]">
          <span className="text-xs text-slate-600 font-medium">Consultation Fee</span>
          <p className="text-sm font-medium text-slate-700">
            <span className="text-lg font-bold text-slate-950">${expert.fee}</span>{" "}
            <span className="text-[11px] text-slate-500 font-light">/ hr</span>
          </p>
        </div>
      </div>

      {/* অ্যাকশন বাটন */}
      <div className="px-6 pb-6 mt-1">
        <Link
          href={`/lawyers/${expert._id}`}
          //  href={`/lawyers/${lawyer._id}`}
          className="block text-center border-2 border-[#464604] text-white hover:bg-transparent hover:text-[#464604] bg-[#464604] text-[11px] font-extrabold tracking-wider uppercase py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          View Full Profile
        </Link>
      </div>
    </motion.div>
  );
}