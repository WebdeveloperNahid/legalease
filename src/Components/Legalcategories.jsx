"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaScaleBalanced,
  FaBuilding,
  FaPeopleRoof,
  FaLaptopCode,
  FaFileSignature,
  FaLandmark,
  FaArrowRight,
} from "react-icons/fa6";

/* ---------- Config ---------- */
// আপনার আসল Browse Lawyers route-এর সাথে মিলিয়ে নিন (navbar-এ যেটা আছে সেটাই)
const BROWSE_BASE = "/lawyers";

/*
  Palette
  Navy #14213D | Deep Navy #0B1526 | Gold #E2B93B
  সাদা background-এ gold লেখা #8A6A1C | Pill #EAF0F9 | Border #DCE3EE
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const categories = [
  { id: 1, name: "Criminal Law", slug: "Criminal", Icon: FaScaleBalanced, count: "12+ Lawyers", desc: "Defense, bail, and trial representation." },
  { id: 2, name: "Corporate Law", slug: "Corporate", Icon: FaBuilding, count: "18+ Lawyers", desc: "Business setup, contracts, and compliance." },
  { id: 3, name: "Family Law", slug: "Family", Icon: FaPeopleRoof, count: "14+ Lawyers", desc: "Divorce, child custody, and settlements." },
  { id: 4, name: "Cyber & Tech Law", slug: "Cyber", Icon: FaLaptopCode, count: "8+ Lawyers", desc: "Data protection, online fraud, and IP rights." },
  { id: 5, name: "Real Estate Law", slug: "Property", Icon: FaFileSignature, count: "11+ Lawyers", desc: "Property disputes, registration, and vetting." },
  { id: 6, name: "Civil Litigation", slug: "Civil", Icon: FaLandmark, count: "22+ Lawyers", desc: "Breach of contract, property damages, and appeals." },
];

export default function LegalCategories() {
  const reduceMotion = useReducedMotion();

  const containerVariant = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
    },
  };

  const itemVariant = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <section className="border-t border-[#DCE3EE] bg-gradient-to-b from-white via-[#F3F6FB] to-[#EEF2F9] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Section header ---------- */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#C99A12]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6A1C]">
              Practice Areas
            </span>
            <span className="h-px w-8 bg-[#C99A12]" aria-hidden="true" />
          </div>

          <h2
            className="mt-4 text-3xl font-bold tracking-[-0.015em] text-[#14213D] sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            Explore Legal Categories
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#475569]">
            Find specialized legal support tailored to your specific case.
          </p>

          <div
            className="mx-auto mt-6 h-[3px] w-16 rounded-full bg-gradient-to-r from-transparent via-[#E2B93B] to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ---------- Grid ---------- */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {categories.map(({ id, name, slug, Icon, count, desc }) => (
            <motion.div key={id} variants={itemVariant} className="h-full">
              <Link
                href={`${BROWSE_BASE}?specialty=${slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[#DCE3EE] bg-white p-6 shadow-[0_4px_16px_rgba(20,33,61,0.05)] outline-none transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#E2B93B]/70 hover:shadow-[0_20px_44px_rgba(20,33,61,0.14)] focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F6FB] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* Icon + count */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14213D] text-lg text-[#E2B93B] transition-colors duration-300 group-hover:bg-[#E2B93B] group-hover:text-[#14213D] motion-reduce:transition-none">
                    <Icon aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-[#DCE3EE] bg-[#EAF0F9] px-3 py-1 text-xs font-semibold text-[#14213D]">
                    {count}
                  </span>
                </div>

                {/* Text */}
                <div className="mt-6">
                  <h3
                    className="text-lg font-bold tracking-[-0.01em] text-[#14213D] transition-colors duration-300 group-hover:text-[#8A6A1C]"
                    style={headingFont}
                  >
                    {name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    {desc}
                  </p>
                </div>

                {/* Link text: সবসময় দেখা যাবে (touch ও keyboard-এর জন্য) */}
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#8A6A1C]">
                  View Lawyers
                  <FaArrowRight
                    aria-hidden="true"
                    className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}