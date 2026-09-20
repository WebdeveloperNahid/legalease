"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import ExpertCard from "./ExpertCard";

const BROWSE_ROUTE = "/lawyers"; // আপনার Browse Lawyers route

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

export default function FeaturedLawyersClient({ featured }) {
  return (
    <section className="border-t border-[#DCE3EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F6FB_35%,#EEF2F9_100%)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Section header ---------- */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6A1C]">
              Our Professionals
            </span>
            <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
          </div>

          <h2
            className="mt-4 text-3xl font-bold tracking-[-0.015em] text-[#0B1526] sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            Featured Lawyers
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Meet our handpicked legal experts, ready to take your case.
          </p>

          <div
            className="mx-auto mt-6 h-[3px] w-16 rounded-full bg-gradient-to-r from-transparent via-[#E2B93B] to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ---------- Cards ---------- */}
        {featured.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-[#0B1526]/20 bg-white px-6 py-14 text-center">
            <p className="text-xl font-bold text-[#0B1526]" style={headingFont}>
              No featured lawyers yet
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Please check back soon, new experts are joining regularly.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              {featured.map((lawyer, index) => (
                <ExpertCard key={lawyer._id} expert={lawyer} index={index} />
              ))}
            </motion.div>

            <div className="mt-12 text-center">
              <Link
                href={BROWSE_ROUTE}
                className="group inline-flex h-12 items-center gap-2 rounded-xl border border-[#0B1526]/25 bg-white px-7 text-sm font-semibold text-[#0B1526] transition-all duration-200 hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B] active:scale-[0.98]"
              >
                View All Lawyers
                <FaArrowRight
                  aria-hidden="true"
                  className="text-xs transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}