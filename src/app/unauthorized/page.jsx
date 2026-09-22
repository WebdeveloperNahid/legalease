"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaHouse, FaLock, FaShieldHalved } from "react-icons/fa6";

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

/* role অনুযায়ী "back to dashboard" route */
const DASHBOARD_BY_ROLE = {
  user: "/dashboard/user",
  client: "/dashboard/user",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

export default function UnauthorizedPage({ isLoggedIn = false, role }) {
  const reduceMotion = useReducedMotion();
  const dashboardHref = DASHBOARD_BY_ROLE[role?.toLowerCase()] || "/";

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
      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(-10%); opacity: 0; }
          8%   { opacity: 0.55; }
          50%  { opacity: 0.35; }
          92%  { opacity: 0; }
          100% { transform: translateY(110%); opacity: 0; }
        }
        @keyframes ringSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmerMove {
          0%   { background-position: 0% 0%; }
          100% { background-position: 120px 120px; }
        }
      `}</style>

      {/* ================= Background decoration ================= */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#FBF6EA 1px, transparent 1px), linear-gradient(90deg, #FBF6EA 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            animation: reduceMotion ? "none" : "shimmerMove 6s linear infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[14rem] font-black leading-none text-transparent sm:text-[22rem]"
          style={{ WebkitTextStroke: "1px rgba(226,185,59,0.08)", ...headingFont }}
        >
          401
        </div>

        <div className="absolute left-1/2 top-1/3 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E2B93B]/15 blur-[140px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#793915]/20 blur-[120px]" />

        {!reduceMotion && (
          <div
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[#E2B93B]/25 to-transparent"
            style={{ animation: "scanLine 7s ease-in-out infinite" }}
          />
        )}

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2B93B]/60 to-transparent" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-xl text-center"
      >
        {/* Icon badge */}
        <motion.div variants={item} className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32">
          {!reduceMotion && (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full bg-[#E2B93B]/20 [animation-duration:2.5s]"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute -inset-2"
                style={{ animation: "ringSpin 14s linear infinite" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#E2B93B"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                />
              </svg>
            </>
          )}
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[3px] shadow-[0_16px_40px_rgba(226,185,59,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B1526]">
              <FaLock aria-hidden="true" className="text-4xl text-[#E2B93B] sm:text-5xl" />
            </div>
          </div>
        </motion.div>

        {/* Trust badge */}
        <motion.div variants={item} className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2B93B]/30 bg-[#0B1526]/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E8DCC8]/70 backdrop-blur-sm">
            <FaShieldHalved aria-hidden="true" className="text-[#E2B93B]" />
            Verified Legal Platform
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.div variants={item} className="mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
            Error 401
          </span>
          <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          style={headingFont}
          className="mt-4 text-3xl font-bold leading-tight tracking-[-0.015em] text-[#FBF6EA] sm:text-5xl"
        >
          Access{" "}
          <span className="bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12] bg-clip-text text-transparent">
            Restricted
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 text-[15px] leading-relaxed text-[#E8DCC8] sm:text-base"
        >
          {isLoggedIn
            ? "Your account does not have permission to view this page. If you think this is a mistake, please contact support."
            : "You need to sign in to view this page. Please log in with an account that has access."}
        </motion.p>

        {/* Actions */}
        <motion.div
          variants={item}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          {isLoggedIn ? (
            <Link href={dashboardHref} className={btnGold}>
              <FaHouse aria-hidden="true" className="text-xs" />
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/signin" className={btnGold}>
              Login Again
              <FaArrowRight aria-hidden="true" className="text-xs" />
            </Link>
          )}
          <Link href="/" className={btnOutline}>
            <FaHouse aria-hidden="true" className="text-xs" />
            Go to Homepage
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
          <Link
            href="/lawyers"
            className={`rounded-full border border-[#FBF6EA]/15 px-4 py-1.5 text-xs font-medium text-[#E8DCC8] transition-colors hover:border-[#E2B93B]/60 hover:text-[#F3D98B] ${focusRing}`}
          >
            Browse Lawyers
          </Link>
          <Link
            href="/contact"
            className={`rounded-full border border-[#FBF6EA]/15 px-4 py-1.5 text-xs font-medium text-[#E8DCC8] transition-colors hover:border-[#E2B93B]/60 hover:text-[#F3D98B] ${focusRing}`}
          >
            Contact
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}