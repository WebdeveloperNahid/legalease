"use client";

import { motion } from "framer-motion";
import ExpertCard from "./ExpertCard";
// import ExpertCard from "@/Components/ExpertCard";

export default function FeaturedLawyersClient({ featured }) {
  return (
    <section className="py-20 bg-white border-t border-[#464604]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* সেকশন হেডার */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#464604] bg-[#464604]/5 px-3 py-1 rounded-md border border-[#464604]/10">
            Our Professionals
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight mt-2">
            Featured Lawyers
          </h2>
          <p className="text-slate-400 text-xs font-light mt-2">
            Meet our handpicked legal experts tailored for excellence
          </p>
          <div className="w-12 h-[2px] bg-[#464604] mx-auto mt-3"></div>
        </div>

        {featured.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full max-w-sm h-96 bg-[#F8F9FA] rounded-xl border animate-pulse p-4"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center"
          >
            {featured.map((lawyer, index) => (
              <ExpertCard key={lawyer._id} expert={lawyer} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}