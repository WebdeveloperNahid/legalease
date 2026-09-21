"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaDollarSign,
  FaHandshake,
  FaReceipt,
  FaScaleBalanced,
  FaUsers,
  FaUsersGear,
} from "react-icons/fa6";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8 | Border #DCE3EE | Tint #F3F6FB
  সাদা background-এ gold লেখা #8A6A1C
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const btnBase = `inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${focusRing}`;
const btnGold = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(226,185,59,0.5)] motion-reduce:hover:translate-y-0`;
const btnOutline = `${btnBase} border border-[#0B1526]/25 bg-white text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]`;

/* ---------- সংখ্যা 0 থেকে গুনে ওঠার animation ---------- */
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !Number.isFinite(target)) {
      setValue(target);
      return;
    }

    let raf;
    const startTime = performance.now();
    setValue(0);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // শেষে ধীরে থামে
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function formatNumber(n, decimals) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ---------- Stat card ---------- */
function StatCard({ label, description, target, money = false, Icon, featured, mounted, index }) {
  const animated = useCountUp(target);
  const decimals = Number.isInteger(target) ? 0 : 2;
  const prefix = money ? "$" : "";

  const shown = `${prefix}${formatNumber(animated, decimals)}`;
  const finalText = `${prefix}${formatNumber(target, decimals)}`;

  return (
    <li
      style={{ transitionDelay: mounted ? `${index * 90}ms` : "0ms" }}
      className={`min-w-0 transition-all duration-500 motion-reduce:transition-none ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6 ${
          featured
            ? "border-[#E2B93B]/40 bg-gradient-to-br from-[#0B1526] to-[#14213D] shadow-[0_10px_30px_rgba(11,21,38,0.25)] hover:shadow-[0_16px_40px_rgba(11,21,38,0.35)]"
            : "border-[#DCE3EE] bg-white hover:border-[#E2B93B] hover:shadow-[0_14px_36px_rgba(11,21,38,0.14)]"
        }`}
      >
        {/* gold top line */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
        />
        {featured && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 right-0 h-32 w-40 rounded-full bg-[#E2B93B]/15 blur-[60px]"
          />
        )}

        <span
          aria-hidden="true"
          className={`relative flex h-11 w-11 items-center justify-center rounded-full text-base sm:h-12 sm:w-12 sm:text-lg ${
            featured
              ? "border border-[#E2B93B]/60 bg-[#0B1526] text-[#E2B93B]"
              : "bg-[#14213D] text-[#E2B93B]"
          }`}
        >
          <Icon />
        </span>

        {/* স্ক্রিন রিডারের জন্য শেষ সংখ্যা, দৃশ্যমান সংখ্যা গুনতে থাকে */}
        <p
          className={`relative mt-5 truncate text-3xl font-bold leading-none tracking-[-0.02em] tabular-nums sm:text-4xl ${
            featured ? "text-[#E2B93B]" : "text-[#0B1526]"
          }`}
          style={headingFont}
        >
          <span aria-hidden="true">{shown}</span>
          <span className="sr-only">{finalText}</span>
        </p>

        <p
          className={`relative mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] ${
            featured ? "text-[#F3D98B]" : "text-[#475569]"
          }`}
        >
          {label}
        </p>
        <p
          className={`relative mt-1 text-xs leading-relaxed ${
            featured ? "text-[#E8DCC8]/85" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>
    </li>
  );
}

/* ---------- Main ---------- */
export default function AnalyticsClient({ stats = {} }) {
  const [mounted, setMounted] = useState(false);

  // পেজ খোলার animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const cards = [
    {
      label: "Total users",
      description: "Accounts registered on LegalEase",
      target: num(stats?.totalUsers),
      Icon: FaUsers,
    },
    {
      label: "Total lawyers",
      description: "Legal professionals on the platform",
      target: num(stats?.totalLawyers),
      Icon: FaScaleBalanced,
    },
    {
      label: "Total hires",
      description: "Hiring requests across the platform",
      target: num(stats?.totalHires),
      Icon: FaHandshake,
    },
    {
      label: "Total revenue",
      description: "Payments collected so far",
      target: num(stats?.totalRevenue),
      money: true,
      Icon: FaDollarSign,
      featured: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div
        className={`overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)] transition-all duration-500 ease-out motion-reduce:transition-none ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-6 py-9 sm:px-10 sm:py-11">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-56 w-80 rounded-full bg-[#E2B93B]/10 blur-[90px]"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
                Admin dashboard
              </span>
            </div>
            <h1
              className="mt-4 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-5xl"
              style={headingFont}
            >
              Analytics <span className="text-[#E2B93B]">overview</span>
            </h1>
            <div
              aria-hidden="true"
              className="mt-4 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              A snapshot of users, lawyers, hires and revenue across LegalEase.
            </p>
          </div>
        </header>

        {/* ---------- Stats ---------- */}
        <div className="bg-[#F3F6FB]/60 p-4 sm:p-8">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Platform totals
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-[#DCE3EE]" />
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {cards.map((c, i) => (
              <StatCard key={c.label} {...c} index={i} mounted={mounted} />
            ))}
          </ul>
        </div>

        {/* ---------- Shortcuts ---------- */}
        <div className="flex flex-col gap-3 border-t border-[#DCE3EE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-[#475569]">Want the details behind these numbers?</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/admin/manage-users" className={`${btnOutline}`}>
              <FaUsersGear aria-hidden="true" className="text-xs" />
              Manage users
            </Link>
            <Link href="/dashboard/admin/all-transactions" className={`${btnGold} group`}>
              <FaReceipt aria-hidden="true" className="text-xs" />
              View transactions
              <FaArrowRight
                aria-hidden="true"
                className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <footer className="border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-4 text-center">
          <p className="text-sm italic text-slate-500">
            Justice is the constant and perpetual will to allot to every man his due.
          </p>
        </footer>
      </div>
    </div>
  );
}