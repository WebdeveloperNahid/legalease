"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getTopExperts } from "@/lib/api/add-lawyer"; // আপনার সেন্ট্রাল এপিআই অ্যাকশন

export default function TopExperts() {
  const [topExperts, setTopExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      const data = await getTopExperts();
      setTopExperts(data);
      setLoading(false);
    };
    fetchExperts();
  }, []);

  return (
    <section className="bg-[#11100c15] py-20 border-t border-[#88865A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✨ সেকশন হেডার */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#FFD500] bg-[#979319] px-4 py-1.5 rounded-full border border-[#88865A]/30">
            Most Hired & Rated
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight mt-3">
            Top Legal Experts
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#FFD500] to-[#AF8752] mx-auto mt-4" />
        </div>

        {/* ⏳ লোডিং স্টেট (Skeleton) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full max-w-[280px] h-64 bg-[#22200f57] border border-[#88865A]/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : topExperts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No expert metrics found.</div>
        ) : (
          
          /* 🎯 মূল গ্রিড লেআউট */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
            {topExperts.map((lawyer, index) => (
              <motion.div 
                key={lawyer._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, borderColor: "#FFD500" }} // হোভার ইফেক্ট
                className="w-full max-w-[280px] bg-[#000000] border border-[#88865A]/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group"
              >
                {/* 👤 1. Avatar (গোল আকৃতির প্রফেশনাল ছবি) */}
                <div className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-b from-[#88865A]/40 to-transparent group-hover:from-[#FFD500] transition-all duration-500 mb-5">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#11100C]">
                    <Image 
                      src={lawyer.image || "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=200"} 
                      alt={lawyer.name}
                      fill
                      unoptimized={true}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* 📝 2. Name (লয়ারের নাম এবং প্রোফাইল লিংক) */}
                <Link href={`/lawyer/${lawyer._id}`}>
                  <h3 className="text-xl font-serif font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-[#FFD500] line-clamp-1">
                    {lawyer.name}
                  </h3>
                </Link>

                {/* 🎖️ সাব-টেক্সট (ক্যাটাগরি - অপশনাল প্রফেশনাল টাচ) */}
                <p className="text-[11px] text-[#88865A] font-semibold mt-2 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                  {lawyer.category || "Senior Attorney"}
                </p>

                {/* ⭐️ সলিড ক্লায়েন্ট ব্যাজ (টপ হায়ারড ইন্ডিকেটর) */}
                <div className="mt-4 bg-[#242304] border border-[#88865A]/30 px-3 py-1 rounded-md text-[10px] font-bold text-[#FFD500] tracking-wider uppercase">
                  Top Tier Expert
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}