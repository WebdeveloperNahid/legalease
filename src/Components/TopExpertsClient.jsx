"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

/* ---------- Config ---------- */
const DETAILS_BASE = "/lawyers"; // Featured card-এর সাথে একই রাখুন, আপনার আসল route মিলিয়ে নিন

/*
  Palette
  Deep Navy #0B1526 | Card #111C33 → #0F1A30 | Gold #E2B93B
  Gold Light #F3D98B | Cream #FBF6EA | Beige #E8DCC8
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

function ExpertItem({ lawyer, index, reduceMotion }) {
  const [imgFailed, setImgFailed] = useState(false);

  const name = lawyer?.name?.trim() || "Unnamed Lawyer";
  const photo = lawyer?.image || lawyer?.photo || lawyer?.imageUrl;
  const specialization =
    lawyer?.specialization || lawyer?.category || "Legal Counsel";
  const hires = Number(lawyer?.totalHires);
  const showHires = Number.isFinite(hires) && hires > 0;
  const initial = name.charAt(0).toUpperCase();
  const showPhoto = photo && !imgFailed;

  const variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, delay: index * 0.1, ease: "easeOut" },
        },
      };

  return (
    <motion.article
      variants={variants}
      className="group relative flex h-full w-full max-w-sm flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#14213D] to-[#0F1A30] px-6 pb-7 pt-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#E2B93B]/50 hover:shadow-[0_24px_50px_rgba(0,0,0,0.5)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#E2B93B] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#0B1526] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Rank */}
      <span
        className="absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-full border border-[#E2B93B]/50 bg-[#E2B93B]/10 px-2 text-sm font-bold text-[#F3D98B]"
        style={headingFont}
      >
        <span className="sr-only">Rank </span>#{index + 1}
      </span>

      {/* Avatar */}
      <div className="relative h-32 w-32 rounded-full bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[3px] shadow-[0_0_0_0_rgba(226,185,59,0)] transition-shadow duration-500 group-hover:shadow-[0_0_28px_rgba(226,185,59,0.4)]">
        <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#0F1A30] bg-[#0B1526]">
          {showPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={`${name}, ${specialization}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#E2B93B]"
              style={headingFont}
            >
              {initial}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3
        className="mt-6 line-clamp-1 text-xl font-bold tracking-[-0.01em] text-[#FBF6EA] transition-colors duration-300 group-hover:text-[#F3D98B] sm:text-2xl"
        style={headingFont}
      >
        {/* পুরো card ক্লিকযোগ্য করার stretched link */}
        <Link
          href={`${DETAILS_BASE}/${lawyer?._id}`}
          className="capitalize outline-none after:absolute after:inset-0 after:content-['']"
        >
          {name}
        </Link>
      </h3>

      {/* Specialization */}
      <p className="mt-2 line-clamp-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#E8DCC8]/80">
        {specialization}
      </p>

      {/* Hires (data থাকলে) */}
      {showHires && (
        <p className="mt-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#E8DCC8]">
          <span className="font-bold text-[#F3D98B]">{hires}</span>{" "}
          {hires === 1 ? "client hired" : "clients hired"}
        </p>
      )}

      {/* CTA */}
      <span
        aria-hidden="true"
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#F3D98B] transition-colors duration-200 group-hover:text-[#E2B93B]"
      >
        View Profile
        <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
      </span>
    </motion.article>
  );
}

export default function TopExpertsClient({ topExperts }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#0B1526] py-20 sm:py-24">
      {/* উপরে হালকা gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[#E2B93B]/10 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Section header ---------- */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
              Most Hired & Rated
            </span>
            <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
          </div>

          <h2
            className="mt-4 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            Top Legal Experts
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#E8DCC8]/85">
            The lawyers our clients hire most, ranked by total hires.
          </p>

          <div
            className="mx-auto mt-6 h-[3px] w-16 rounded-full bg-gradient-to-r from-transparent via-[#E2B93B] to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ---------- Cards ---------- */}
        {topExperts.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-14 text-center">
            <p className="text-xl font-bold text-[#FBF6EA]" style={headingFont}>
              No top experts yet
            </p>
            <p className="mt-2 text-sm text-[#E8DCC8]/80">
              Rankings will appear here as clients start hiring lawyers.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {topExperts.map((lawyer, index) => (
              <ExpertItem
                key={lawyer._id}
                lawyer={lawyer}
                index={index}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}