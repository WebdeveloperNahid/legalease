"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaHouse,
  FaMagnifyingGlass,
  FaScaleBalanced,
} from "react-icons/fa6";

/*
  Palette: Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B
  Gold Light #F3D98B | Gold Dark #C99A12 | Cream #FBF6EA | Beige #E8DCC8
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

const btnBase = `inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] sm:w-auto ${focusRing}`;

const btnGold = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_10px_30px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(226,185,59,0.5)]`;

const btnOutline = `${btnBase} border border-[#FBF6EA]/35 bg-[#0B1526]/30 text-[#FBF6EA] backdrop-blur-sm hover:border-[#E2B93B] hover:bg-[#0B1526]/60 hover:text-[#F3D98B]`;

const QUICK_LINKS = [
  { label: "Sign In", href: "/signin" },
  { label: "Sign Up", href: "/signup" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const reduceMotion = useReducedMotion();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/lawyers?search=${encodeURIComponent(q)}` : "/lawyers");
  };

  const item = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
      };

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  return (
    <section className="relative flex min-h-[calc(100svh-72px)] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-4 py-16">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#FBF6EA 1px, transparent 1px), linear-gradient(90deg, #FBF6EA 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-1/2 top-1/3 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E2B93B]/15 blur-[140px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#793915]/20 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2B93B]/60 to-transparent" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-xl text-center"
      >
        {/* Icon badge */}
        <motion.div variants={item} className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28">
          {!reduceMotion && (
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full bg-[#E2B93B]/20 [animation-duration:2.5s]"
            />
          )}
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[3px] shadow-[0_16px_40px_rgba(226,185,59,0.3)]"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B1526]">
              <FaScaleBalanced
                aria-hidden="true"
                className="text-4xl text-[#E2B93B] sm:text-5xl"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div variants={item} className="mt-9 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
            Error 404
          </span>
          <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          style={headingFont}
          className="mt-4 text-3xl font-bold leading-tight tracking-[-0.015em] text-[#FBF6EA] sm:text-5xl"
        >
          This case couldn&apos;t be{" "}
          <span className="bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12] bg-clip-text text-transparent">
            found
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 text-[15px] leading-relaxed text-[#E8DCC8] sm:text-base"
        >
          The page you are looking for may have been moved, renamed, or no
          longer exists. Let&apos;s get you back on track.
        </motion.p>

        {/* Search */}
        <motion.form
          variants={item}
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-2xl border border-[#FBF6EA]/15 bg-[#0B1526]/50 p-2 backdrop-blur-sm transition-colors focus-within:border-[#E2B93B]/60 focus-within:ring-4 focus-within:ring-[#E2B93B]/15"
        >
          <FaMagnifyingGlass
            aria-hidden="true"
            className="ml-3 shrink-0 text-[#E8DCC8]/60"
          />
          <label htmlFor="notfound-search" className="sr-only">
            Search for a lawyer
          </label>
          <input
            id="notfound-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a lawyer..."
            className="h-10 flex-1 bg-transparent text-sm text-[#FBF6EA] placeholder:text-[#E8DCC8]/50 outline-none"
          />
          <button
            type="submit"
            className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] px-4 text-sm font-bold text-[#0B1526] transition-all hover:-translate-y-0.5 ${focusRing}`}
          >
            Search
            <FaArrowRight aria-hidden="true" className="text-xs" />
          </button>
        </motion.form>

        {/* Actions */}
        <motion.div
          variants={item}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/" className={btnGold}>
            <FaHouse aria-hidden="true" className="text-xs" />
            Go to Homepage
          </Link>
          <Link href="/lawyers" className={btnOutline}>
            Browse Lawyers
            <FaArrowRight aria-hidden="true" className="text-xs" />
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-[#FBF6EA]/10 pt-7"
        >
          <span className="mr-1 text-xs font-medium uppercase tracking-[0.12em] text-[#E8DCC8]/50">
            Or try
          </span>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border border-[#FBF6EA]/15 px-4 py-1.5 text-xs font-medium text-[#E8DCC8] transition-colors hover:border-[#E2B93B]/60 hover:text-[#F3D98B] ${focusRing}`}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}