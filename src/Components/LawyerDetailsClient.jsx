"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarDays,
  FaCircleCheck,
  FaMagnifyingGlass,
  FaQuoteLeft,
  FaScaleBalanced,
  FaShieldHalved,
} from "react-icons/fa6";

/* ---------- Config ---------- */
const CURRENCY = "$"; // Browse card-এর সাথে একই রাখুন
const BROWSE_ROUTE = "/lawyers";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8 | Border #DCE3EE | Tint #F3F6FB
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

const btnBase = `inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] ${focusRing}`;
const btnGold = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(226,185,59,0.5)]`;
const btnOutline = `${btnBase} border border-[#0B1526]/25 bg-white text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]`;

/* ---------- Helpers ---------- */
function toYear(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
}

function toDateText(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* শুধু available/busy ধরনের মান দেখাবে, অন্য মান (যেমন pending) লুকানো থাকবে */
function getStatus(status) {
  if (!status) return null;
  const s = String(status).toLowerCase().trim();
  if (["available", "online", "active"].includes(s))
    return { label: "Available for consultation", ok: true };
  if (["busy", "unavailable", "offline", "away"].includes(s))
    return { label: "Currently busy", ok: false };
  return null;
}

/* ছবি, না থাকলে বা লোড না হলে নামের প্রথম অক্ষর */
function Photo({ src, name, alt, textClass = "text-5xl" }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center font-bold text-[#E2B93B] ${textClass}`}
      style={headingFont}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/* ---------- Main ---------- */
export default function LawyerDetailsClient({ lawyer, reviews = [] }) {
  const [showHireModal, setShowHireModal] = useState(false);
  const dialogRef = useRef(null);

  /* Modal: Escape, focus আটকানো, scroll বন্ধ, বন্ধ হলে আগের জায়গায় focus ফেরা */
  useEffect(() => {
    if (!showHireModal) return;
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    const getFocusable = () =>
      dialog
        ? Array.from(dialog.querySelectorAll("a[href], button:not([disabled])"))
        : [];

    getFocusable()[0]?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowHireModal(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [showHireModal]);

  /* ---------- Not found ---------- */
  if (!lawyer) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#F3F6FB] px-4 py-16">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white text-center shadow-[0_10px_36px_rgba(11,21,38,0.1)]">
          <div
            aria-hidden="true"
            className="h-1.5 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div className="p-8">
            <span
              aria-hidden="true"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B1526] text-xl text-[#E2B93B]"
            >
              <FaMagnifyingGlass />
            </span>
            <h1
              className="mt-5 text-2xl font-bold text-[#0B1526]"
              style={headingFont}
            >
              Lawyer not found
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              This profile may have been removed.
            </p>
            <Link href={BROWSE_ROUTE} className={`${btnGold} mt-6`}>
              Browse lawyers
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Data ---------- */
  const name = lawyer?.name?.trim() || "Unnamed Lawyer";
  const specialization =
    lawyer?.specialization || lawyer?.specialty || "Legal Counsel";
  const photo = lawyer?.image || lawyer?.photo || lawyer?.imageUrl;
  const bio = lawyer?.bio?.trim();
  const status = getStatus(lawyer?.status);
  const memberYear = toYear(lawyer?.createdAt);

  const rawFee = lawyer?.fee;
  const hasFee = rawFee !== undefined && rawFee !== null && rawFee !== "";
  const feeText = hasFee ? `${CURRENCY}${rawFee}` : "On request";

  const details = [
    { icon: FaScaleBalanced, label: "Specialization", value: specialization },
    status && {
      icon: FaCircleCheck,
      label: "Availability",
      value: status.ok ? "Available" : "Busy",
    },
    memberYear && {
      icon: FaCalendarDays,
      label: "Member since",
      value: String(memberYear),
    },
  ].filter(Boolean);

  const reviewCount = reviews.length;

  return (
    <div className="bg-[#F3F6FB]">
      {/* ================= Hero ================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] pb-24 pt-8 sm:pb-28 sm:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-[#E2B93B]/15 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2B93B]/80 to-transparent"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href={BROWSE_ROUTE}
            className={`inline-flex items-center gap-2 rounded-lg text-sm font-medium text-[#E8DCC8] transition-colors hover:text-[#F3D98B] ${focusRing}`}
          >
            <FaArrowLeft aria-hidden="true" className="text-xs" />
            Back to all lawyers
          </Link>

          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="h-32 w-32 shrink-0 rounded-3xl bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[3px] shadow-[0_16px_40px_rgba(0,0,0,0.4)] sm:h-40 sm:w-40">
              <div className="h-full w-full overflow-hidden rounded-[21px] bg-[#0B1526]">
                <Photo
                  src={photo}
                  name={name}
                  alt={`${name}, ${specialization}`}
                  textClass="text-6xl"
                />
              </div>
            </div>

            <div className="min-w-0">
              <span className="inline-flex max-w-full items-center rounded-full border border-[#E2B93B]/50 bg-[#E2B93B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F3D98B]">
                <span className="truncate">{specialization}</span>
              </span>

              <h1
                className="mt-3 text-3xl font-bold capitalize leading-tight tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl lg:text-5xl"
                style={headingFont}
              >
                {name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#E8DCC8]">
                {status && (
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${
                        status.ok ? "bg-[#4ADE80]" : "bg-[#FBBF24]"
                      }`}
                    />
                    {status.label}
                  </span>
                )}
                {memberYear && <span>Member since {memberYear}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="relative mx-auto -mt-12 max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* ---------- Hire card ---------- */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_18px_46px_rgba(11,21,38,0.16)]">
              <div
                aria-hidden="true"
                className="h-1.5 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
              />
              <div className="p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  Consultation fee
                </p>
                <p
                  className="mt-1 text-4xl font-bold text-[#0B1526]"
                  style={headingFont}
                >
                  {feeText}
                  {hasFee && (
                    <span className="ml-1 text-base font-medium text-slate-500">
                      /hr
                    </span>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => setShowHireModal(true)}
                  className={`${btnGold} mt-5`}
                >
                  Send Hiring Request
                  <FaArrowRight aria-hidden="true" className="text-xs" />
                </button>

                {status && !status.ok && (
                  <p className="mt-3 rounded-lg bg-[#FFF7E6] px-3 py-2 text-xs leading-relaxed text-[#92400E]">
                    This lawyer is currently busy, so a reply may take longer.
                  </p>
                )}

                <ul className="mt-6 space-y-3 border-t border-[#DCE3EE] pt-5 text-sm text-slate-600">
                  {[
                    "Pay only after the lawyer accepts",
                    "Secure checkout powered by Stripe",
                    "Track every request from your dashboard",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <FaCircleCheck
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[#E2B93B]"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* ---------- Main column ---------- */}
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
            {/* About */}
            <section
              aria-labelledby="about-heading"
              className="rounded-2xl border border-[#DCE3EE] bg-white p-6 shadow-[0_6px_22px_rgba(11,21,38,0.06)] sm:p-8"
            >
              <h2
                id="about-heading"
                className="text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
                style={headingFont}
              >
                Professional summary
              </h2>
              <div
                aria-hidden="true"
                className="mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
              />
              <p className="mt-5 whitespace-pre-line text-base leading-[1.8] text-slate-700">
                {bio ||
                  "This lawyer has not added a professional summary yet."}
              </p>

              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {details.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-4"
                  >
                    <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      <Icon
                        aria-hidden="true"
                        className="text-[#8A6A1C]"
                      />
                      {label}
                    </dt>
                    <dd className="mt-1.5 break-words font-bold capitalize text-[#0B1526]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Reviews */}
            <section
              aria-labelledby="reviews-heading"
              className="rounded-2xl border border-[#DCE3EE] bg-white p-6 shadow-[0_6px_22px_rgba(11,21,38,0.06)] sm:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="reviews-heading"
                  className="text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
                  style={headingFont}
                >
                  Client reviews
                </h2>
                <span className="shrink-0 rounded-full border border-[#D3DDEC] bg-[#EAF0F9] px-3 py-1 text-xs font-bold text-[#14213D]">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
              />

              {reviewCount === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-[#0B1526]/20 bg-[#F3F6FB] px-6 py-10 text-center">
                  <p
                    className="text-lg font-bold text-[#0B1526]"
                    style={headingFont}
                  >
                    No reviews yet
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Be the first to hire and share your experience.
                  </p>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {reviews.map((review) => {
                    const reviewer = review?.userName?.trim() || "Client";
                    const date = toDateText(review?.createdAt);
                    return (
                      <li
                        key={review._id}
                        className="rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-5"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1526] text-sm font-bold text-[#E2B93B]"
                          >
                            {reviewer.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#0B1526]">
                              {reviewer}
                            </p>
                            {date && (
                              <p className="text-xs text-slate-500">{date}</p>
                            )}
                          </div>
                        </div>
                        <p className="mt-3 flex gap-2.5 text-sm leading-[1.75] text-slate-700">
                          <FaQuoteLeft
                            aria-hidden="true"
                            className="mt-1 shrink-0 text-xs text-[#E2B93B]"
                          />
                          <span>{review.comment}</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                <FaShieldHalved aria-hidden="true" className="text-[#8A6A1C]" />
                Only clients who hired and paid this lawyer can leave a review.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* ================= Hire modal ================= */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            aria-hidden="true"
            onClick={() => setShowHireModal(false)}
            className="absolute inset-0 bg-[#0B1526]/70 backdrop-blur-sm"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hire-modal-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E2B93B]/30 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.45)]"
          >
            <div
              aria-hidden="true"
              className="h-1.5 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
            />
            <div className="p-6 sm:p-8">
              <h2
                id="hire-modal-title"
                className="text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
                style={headingFont}
              >
                Send hiring request
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                You are about to request{" "}
                <span className="font-bold capitalize text-[#0B1526]">
                  {name}
                </span>
                . You will review the details on the next page before anything
                is sent.
              </p>

              <div className="mt-5 flex items-center gap-4 rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-4">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[2px]">
                  <div className="h-full w-full overflow-hidden rounded-[10px] bg-[#0B1526]">
                    <Photo
                      src={photo}
                      name={name}
                      alt=""
                      textClass="text-xl"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold capitalize text-[#0B1526]">
                    {name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {specialization}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    Fee
                  </p>
                  <p
                    className="text-lg font-bold text-[#0B1526]"
                    style={headingFont}
                  >
                    {feeText}
                    {hasFee && (
                      <span className="text-xs font-medium text-slate-500">
                        /hr
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <FaCircleCheck aria-hidden="true" className="text-[#E2B93B]" />
                No payment now. You pay only after the lawyer accepts.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowHireModal(false)}
                  className={btnOutline}
                >
                  Cancel
                </button>
                <Link href={`/lawyers/${lawyer._id}/hiring`} className={btnGold}>
                  Continue
                  <FaArrowRight aria-hidden="true" className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}