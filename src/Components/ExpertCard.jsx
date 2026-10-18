"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

/* ---------- Config ---------- */
const DETAILS_BASE = "/lawyers"; 
const CURRENCY = "$"; 

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

/* Status Handler */
function getStatus(status) {
  if (!status) return null;
  const s = String(status).toLowerCase().trim();
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  if (["available", "online", "active"].includes(s)) return { label, ok: true };
  if (["busy", "unavailable", "offline", "away"].includes(s)) return { label, ok: false };
  return null;
}

export default function ExpertCard({ expert, index = 0 }) {
  const reduceMotion = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);

  const name = expert?.name?.trim() || "Unnamed Lawyer";
  const photo = expert?.image || expert?.photo || expert?.imageUrl;
  const specialization = expert?.specialization || "Legal Counsel";
  const bio = expert?.bio?.trim() || "Dedicated legal professional committed to delivering justice & legal support.";
  const status = getStatus(expert?.status);

  const feeNumber = Number(String(expert?.fee ?? "").replace(/[^\d.]/g, ""));
  const hasFee = Number.isFinite(feeNumber) && feeNumber > 0;
  const feeText = hasFee ? `${CURRENCY}${feeNumber.toLocaleString()}` : "On Request";

  const initial = name.charAt(0).toUpperCase();
  const showPhoto = photo && !imgFailed;

  const variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: index * 0.05, ease: "easeOut" },
        },
      };

  return (
    <motion.article
      variants={variants}
      className="group relative flex flex-col h-full w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#14213D]/30 hover:shadow-2xl hover:shadow-slate-300/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#E2B93B]"
    >
      {/* ---------- Image Container (Fixed Aspect & Full View) ---------- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={`${name} - ${specialization}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#1E293B]"
          >
            <span className="text-5xl font-bold text-[#E2B93B] tracking-wider" style={headingFont}>
              {initial}
            </span>
          </div>
        )}

        {/* Elegant Gradient Overlay for Badges Readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Status Badge (Top Left) */}
        {status && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-md border shadow-sm ${
                status.ok
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 bg-white/95"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-800 bg-white/95"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${status.ok ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
              />
              {status.label}
            </span>
          </div>
        )}

        {/* Specialization Badge (Bottom Left on Image) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center rounded-lg bg-[#0B1526]/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E2B93B] backdrop-blur-md border border-white/15 shadow-md">
            {specialization}
          </span>
        </div>
      </div>

      {/* ---------- Card Content ---------- */}
      <div className="flex flex-1 flex-col p-5 bg-gradient-to-b from-white to-slate-50/50">
        {/* Name */}
        <h3
          className="text-xl font-bold text-[#0B1526] group-hover:text-[#14213D] transition-colors"
          style={headingFont}
        >
          <Link
            href={`${DETAILS_BASE}/${expert?._id}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {name}
          </Link>
        </h3>

        {/* Bio */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 flex-1">
          {bio}
        </p>

        {/* Divider & Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex items-center justify-between gap-3 z-10">
          <div className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Consultation Fee
            </span>
            <span className="truncate text-base font-extrabold text-[#0B1526]">
              {feeText}
            </span>
          </div>

          {/* Professional Action Button with Hover Effect */}
          <span
            aria-hidden="true"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0B1526] px-4 text-xs font-semibold text-white transition-all duration-300 group-hover:bg-[#E2B93B] group-hover:text-[#0B1526] group-hover:shadow-md shadow-sm"
          >
            View Profile
            <FaArrowRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}