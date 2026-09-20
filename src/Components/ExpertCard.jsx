"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

/* ---------- Config ---------- */
const DETAILS_BASE = "/lawyers"; // আপনার Lawyer Details route-এর ফোল্ডার অনুযায়ী ঠিক করুন
const CURRENCY = "$"; // টাকা চাইলে "৳"

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Section tint #F3F6FB
  Pill bg #EAF0F9   | Border #DCE3EE | Gold #E2B93B
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

/* শুধু Available/Busy ধরনের মান badge-এ দেখাবে; "pending" ইত্যাদি লুকানো থাকবে */
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
  const bio = expert?.bio?.trim();
  const status = getStatus(expert?.status);

  const feeNumber = Number(String(expert?.fee ?? "").replace(/[^\d.]/g, ""));
  const hasFee = Number.isFinite(feeNumber) && feeNumber > 0;
  const feeText = hasFee ? `${CURRENCY}${feeNumber.toLocaleString()}` : "On request";

  const initial = name.charAt(0).toUpperCase();
  const showPhoto = photo && !imgFailed;

  const variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.08, ease: "easeOut" },
        },
      };

  return (
    <motion.article
      variants={variants}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_4px_16px_rgba(11,21,38,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#0B1526]/20 hover:shadow-[0_22px_48px_rgba(11,21,38,0.18)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#E2B93B] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#F3F6FB] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* ---------- Image (square) ---------- */}
      <div className="relative aspect-[5/4] overflow-hidden bg-[#14213D] sm:aspect-square">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={`${name}, ${specialization}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526]"
          >
            <span className="text-7xl font-bold text-[#E2B93B]" style={headingFont}>
              {initial}
            </span>
          </div>
        )}

        {/* নিচে হালকা ছায়া */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1526]/40 to-transparent" />

        {/* Status */}
        {status && (
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md sm:left-4 sm:top-4 ${
              status.ok ? "text-[#15803D]" : "text-[#B45309]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                status.ok ? "bg-[#15803D]" : "bg-[#B45309]"
              }`}
            />
            {status.label}
          </span>
        )}
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D3DDEC] bg-[#EAF0F9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#14213D]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#E2B93B]" />
          {specialization}
        </span>

        <h3
          className="mt-3 text-xl font-bold leading-tight tracking-[-0.01em] text-[#0B1526] sm:text-2xl"
          style={headingFont}
        >
          {/* পুরো card ক্লিকযোগ্য করার stretched link */}
          <Link
            href={`${DETAILS_BASE}/${expert?._id}`}
            className="bg-[linear-gradient(#E2B93B,#E2B93B)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 capitalize outline-none transition-[background-size] duration-300 after:absolute after:inset-0 after:content-[''] group-hover:bg-[length:100%_2px] motion-reduce:transition-none"
          >
            {name}
          </Link>
        </h3>

        {/* সব card-এর উচ্চতা সমান রাখতে জায়গা সংরক্ষিত */}
        <p className="mt-3 min-h-[3rem] line-clamp-2 text-sm leading-relaxed text-slate-600">
          {bio}
        </p>

        {/* ---------- Footer ---------- */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#DCE3EE] pt-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
              Consultation fee
            </p>
            <p className="mt-0.5 truncate text-xl font-bold text-[#0B1526]">{feeText}</p>
          </div>

          {/* hover-এ navy থেকে সোনালি */}
          <span
            aria-hidden="true"
            className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[#0B1526] px-4 text-sm font-semibold text-[#FBF6EA] transition-all duration-200 group-hover:bg-[#E2B93B] group-hover:text-[#0B1526] group-hover:shadow-[0_6px_16px_rgba(226,185,59,0.35)]"
          >
            View Profile
            <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}