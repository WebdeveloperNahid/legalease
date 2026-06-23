"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { id: 1, name: "Criminal Law", slug: "Criminal", icon: "⚖️", count: "12+ Lawyers", desc: "Defense, bail, and trial representation." },
  { id: 2, name: "Corporate Law", slug: "Corporate", icon: "🏢", count: "18+ Lawyers", desc: "Business setup, contracts, and compliance." },
  { id: 3, name: "Family Law", slug: "Family", icon: "🏠", count: "14+ Lawyers", desc: "Divorce, child custody, and settlements." },
  { id: 4, name: "Cyber & Tech Law", slug: "Cyber", icon: "💻", count: "8+ Lawyers", desc: "Data protection, online fraud, and IP rights." },
  { id: 5, name: "Real Estate Law", slug: "Property", icon: "📜", count: "11+ Lawyers", desc: "Property disputes, registration, and vetting." },
  { id: 6, name: "Civil Litigation", slug: "Civil", icon: "🏛️", count: "22+ Lawyers", desc: "Breach of contract, property damages, and appeals." },
];

export default function LegalCategories() {
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    // ✅ সেকশনের ব্যাকগ্রাউন্ডকে সুন্দর প্রফেশনাল মিস্ট-হোয়াইট করা হয়েছে
    <section className="bg-[#F9FAFAF2] py-24 border-t border-[#464604]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* সেকশন হেডার */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#464604] bg-[#464604]/10 px-3 py-1 rounded-md border border-[#464604]/20">
            Practice Areas
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight mt-3">
            Explore Legal Categories
          </h2>
          <p className="text-slate-500 text-xs font-normal mt-2">Find specialized legal support tailored to your specific case</p>
          <div className="w-12 h-[2px] bg-[#464604] mx-auto mt-4"></div>
        </div>

        {/* গ্রিড কন্টেইনার */}
        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/lawyers?specialty=${cat.slug}`}
              className="block"
            >
              <motion.div
                variants={itemVariant}
                whileHover={{ y: -6, scale: 1.01, border: "1px solid rgba(70,70,4,0.3)" }}
                // ✅ কার্ডের কালার স্পষ্ট প্রফেশনাল বেইজ-অলিভ (#F0F2E8) এবং বর্ডার স্ট্রং করা হয়েছে
                className="bg-[#F0F2E8] border border-[#DEE1D3] rounded-2xl p-6 transition-all duration-400 shadow-[0_4px_15px_rgba(70,70,4,0.02)] hover:shadow-[0_20px_40px_rgba(70,70,4,0.08)] group"
              >
                <div className="flex items-start justify-between">
                  {/* আইকন বক্স */}
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-[#DEE1D3] group-hover:bg-[#464604] group-hover:text-white transition-all duration-300">
                    {cat.icon}
                  </div>
                  {/* কাউন্ট ব্যাজ */}
                  <span className="text-[10px] font-extrabold text-[#464604] bg-white border border-[#DEE1D3] px-2.5 py-0.5 rounded-full shadow-sm">
                    {cat.count}
                  </span>
                </div>

                {/* টেক্সট কন্টেন্ট */}
                <div className="mt-6 space-y-2">
                  <h3 className="font-serif font-bold text-slate-950 text-base group-hover:text-[#464604] transition-colors duration-300">
                    {cat.name}
                  </h3>
                  {/* বিবরণী লেখার কালার একটু ডিপ করা হয়েছে পড়ার সুবিধার জন্য */}
                  <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                {/* এক্সপ্লোর বাটন লিংক */}
                <div className="mt-5 flex items-center gap-1.5 text-[11px] font-extrabold text-[#464604] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-5px] group-hover:translate-x-0">
                  <span>Explore Advocates</span>
                  <span>→</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

      </div>
    </section>
  );
}