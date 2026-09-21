// src/Components/BrowserLawyersClient.jsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import {
  FaArrowRight,
  FaChevronDown,
  FaMagnifyingGlass,
  FaScaleBalanced,
  FaXmark,
} from "react-icons/fa6";

/* ---------- Config ---------- */
const DETAILS_BASE = "/lawyers"; // আপনার আসল Lawyer Details route-এর সাথে মিলিয়ে নিন
const CURRENCY = "$"; // আপনার আসল মুদ্রার সাথে মিলিয়ে নিন
const FEE_UNIT = "/hr";
const DEBOUNCE_MS = 400;
const SKELETON_COUNT = 6;

const SPECIALTIES = [
  "Criminal Law",
  "Corporate Law",
  "Family Law",
  "Tax Law",
  "Civil Law",
  "Immigration Law",
  "Real Estate Law",
  "Labor Law",
];

const AVAILABILITY_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Busy", label: "Currently Busy" },
];

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B | Gold Light #F3D98B
  Gold Dark #C99A12 | সাদা background-এ gold লেখা #8A6A1C
  Cream #FBF6EA | Beige #E8DCC8 | Pill #EAF0F9 | Border #DCE3EE
  Status: সবুজ #15803D | কমলা #B45309
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const STATUS_STYLES = {
  available: {
    label: "Available Now",
    pill: "border-[#15803D]/30 bg-white text-[#15803D]",
    dot: "bg-[#15803D]",
  },
  busy: {
    label: "Currently Busy",
    pill: "border-[#B45309]/30 bg-white text-[#B45309]",
    dot: "bg-[#B45309]",
  },
};

/* ---------- Helpers ---------- */
function buildQuery(search, specialty, availability) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (specialty) params.set("specialty", specialty);
  if (availability) params.set("availability", availability);
  return params.toString();
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function BrowseLawyersClient({
  initialLawyers,
  initialSearch,
  initialSpecialty,
  initialAvailability,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [availability, setAvailability] = useState(initialAvailability);

  // সর্বশেষ যে query URL-এ আছে (অকারণে প্রথমবার বা একই query আবার push ঠেকাতে)
  const lastQuery = useRef(
    buildQuery(initialSearch, initialSpecialty, initialAvailability)
  );

  // ডিবাউন্স করে URL আপডেট -> Server Component রি-রান -> নতুন ডেটা
  useEffect(() => {
    const query = buildQuery(search, specialty, availability);
    if (query === lastQuery.current) return;

    const timeout = setTimeout(() => {
      lastQuery.current = query;
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search, specialty, availability, pathname, router]);

  const lawyers = initialLawyers;
  const loading = isPending;
  const hasFilters = Boolean(search || specialty || availability);

  const clearFilters = () => {
    setSearch("");
    setSpecialty("");
    setAvailability("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F6FB] to-[#EEF2F9]">
      {/* ---------- Page Header (hero) ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1526] to-[#14213D] px-4 pb-28 pt-16 text-center sm:pb-32 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-[#E2B93B]/10 blur-[110px]"
        />

        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E2B93B]/30 bg-[#E2B93B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F3D98B]">
            <FaScaleBalanced aria-hidden="true" className="text-[11px]" />
            Verified Legal Network
          </span>

          <h1
            className="mt-6 text-4xl font-bold leading-[1.15] tracking-[-0.015em] text-[#FBF6EA] sm:text-5xl lg:text-6xl"
            style={headingFont}
          >
            Find Your Legal Expert
          </h1>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 h-[3px] w-16 rounded-full bg-gradient-to-r from-transparent via-[#E2B93B] to-transparent"
          />

          <p className="mt-5 text-base leading-relaxed text-[#E8DCC8]/85 sm:text-lg">
            Browse verified legal professionals across all practice areas. Hire
            with confidence.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* ---------- Search & Filter ---------- */}
        <FilterBar
          search={search}
          onSearch={setSearch}
          specialty={specialty}
          onSpecialty={setSpecialty}
          availability={availability}
          onAvailability={setAvailability}
        />

        {/* ---------- Results ---------- */}
        <div className="mt-10">
          {loading ? (
            <>
              <p
                role="status"
                className="mb-6 text-sm text-[#475569]"
              >
                Searching lawyers…
              </p>
              <SkeletonGrid />
            </>
          ) : lawyers.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p
                  role="status"
                  aria-live="polite"
                  className="text-sm text-[#475569]"
                >
                  Showing{" "}
                  <strong className="font-semibold text-[#14213D]">
                    {lawyers.length}
                  </strong>{" "}
                  legal {lawyers.length === 1 ? "professional" : "professionals"}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`rounded-md text-sm font-semibold text-[#8A6A1C] underline-offset-4 transition-colors hover:underline ${focusRing}`}
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {lawyers.map((lawyer) => (
                  <li key={lawyer._id} className="h-full">
                    <LawyerCard lawyer={lawyer} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FILTER BAR
   ============================================================ */
function FilterBar({
  search,
  onSearch,
  specialty,
  onSpecialty,
  availability,
  onAvailability,
}) {
  const searchId = useId();
  const specialtyId = useId();
  const availabilityId = useId();

  // URL থেকে আসা specialty (যেমন Home-এর category link) তালিকায় না থাকলেও select-এ দেখাবে
  const specialtyOptions =
    specialty && !SPECIALTIES.includes(specialty)
      ? [specialty, ...SPECIALTIES]
      : SPECIALTIES;

  const fieldBase =
    "h-12 w-full rounded-xl border border-[#DCE3EE] bg-white text-base text-[#14213D] outline-none transition-all duration-200 hover:border-[#B9C5D8] focus:border-[#E2B93B] focus:ring-2 focus:ring-[#E2B93B]/30 sm:text-sm";

  return (
    <div
      role="search"
      className="mx-auto -mt-14 grid max-w-5xl gap-3 rounded-2xl border border-[#DCE3EE] bg-white p-4 shadow-[0_18px_50px_rgba(11,21,38,0.18)] sm:p-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]"
    >
      {/* Search */}
      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Search lawyers by name
        </label>
        <FaMagnifyingGlass
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8A6A1C]"
        />
        <input
          id={searchId}
          type="text"
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={`${fieldBase} pl-11 pr-11 placeholder:text-[#64748B]`}
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearch("")}
            className={`absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#EAF0F9] hover:text-[#14213D] ${focusRing}`}
          >
            <FaXmark aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Specialization */}
      <div className="relative">
        <label htmlFor={specialtyId} className="sr-only">
          Filter by specialization
        </label>
        <select
          id={specialtyId}
          value={specialty}
          onChange={(e) => onSpecialty(e.target.value)}
          className={`${fieldBase} cursor-pointer appearance-none pl-4 pr-10`}
        >
          <option value="">All Specializations</option>
          {specialtyOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <FaChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#64748B]"
        />
      </div>

      {/* Availability */}
      <div className="relative">
        <label htmlFor={availabilityId} className="sr-only">
          Filter by availability
        </label>
        <select
          id={availabilityId}
          value={availability}
          onChange={(e) => onAvailability(e.target.value)}
          className={`${fieldBase} cursor-pointer appearance-none pl-4 pr-10`}
        >
          <option value="">All Availability</option>
          {AVAILABILITY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <FaChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#64748B]"
        />
      </div>
    </div>
  );
}

/* ============================================================
   LAWYER CARD
   ============================================================ */
function LawyerCard({ lawyer }) {
  const [imgFailed, setImgFailed] = useState(false);

  const name = lawyer?.name?.trim() || "Unnamed Lawyer";
  const photo = lawyer?.image || lawyer?.photo || lawyer?.imageUrl;
  const specialization =
    lawyer?.specialization || lawyer?.specialty || "Legal Expert";
  const initial = name.charAt(0).toUpperCase();
  const showPhoto = photo && !imgFailed;

  // শুধু available / busy হলে badge দেখাবে, অন্য কিছু হলে লুকানো
  const availabilityKey = String(lawyer?.availability || "").toLowerCase();
  const status = STATUS_STYLES[availabilityKey];

  const hasFee = lawyer?.fee !== undefined && lawyer?.fee !== null && lawyer?.fee !== "";
  const memberYear = lawyer?.createdAt
    ? new Date(lawyer.createdAt).getFullYear()
    : null;
  const showMemberYear = Number.isFinite(memberYear);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_4px_16px_rgba(20,33,61,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#E2B93B]/70 hover:shadow-[0_22px_48px_rgba(20,33,61,0.16)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#E2B93B] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#F3F6FB] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* hover-এ আঁকা gold রেখা */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#C99A12] via-[#E2B93B] to-[#F3D98B] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
      />

      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-[76px] w-[76px] shrink-0 rounded-full bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[2px]">
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-white bg-[#14213D]">
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
                  className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#E2B93B]"
                  style={headingFont}
                >
                  {initial}
                </div>
              )}
            </div>
          </div>

          {/* Name + tags */}
          <div className="min-w-0 flex-1 pt-0.5">
            <h3
              className="line-clamp-1 text-lg font-bold leading-tight tracking-[-0.01em] text-[#14213D] transition-colors duration-300 group-hover:text-[#8A6A1C]"
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

            <span className="mt-2 inline-block max-w-full truncate rounded-full border border-[#DCE3EE] bg-[#EAF0F9] px-2.5 py-1 text-xs font-semibold text-[#14213D]">
              {specialization}
            </span>

            {status && (
              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.pill}`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                  />
                  {status.label}
                </span>
              </div>
            )}
          </div>
        </div>

        <div aria-hidden="true" className="my-5 h-px bg-[#E6ECF5]" />

        {/* Bio */}
        <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-[#475569]">
          {lawyer?.bio?.trim() || "This lawyer hasn't added a bio yet."}
        </p>

        {/* Stats */}
        <div
          className={`mt-5 grid gap-3 ${showMemberYear ? "grid-cols-2" : "grid-cols-1"}`}
        >
          <div className="rounded-xl border border-[#E8DCC8] bg-[#FBF6EA]/70 px-3.5 py-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A6A1C]">
              Consultation Fee
            </p>
            <p
              className="mt-1 text-2xl font-bold leading-none text-[#14213D]"
              style={headingFont}
            >
              {hasFee ? `${CURRENCY}${lawyer.fee}` : "—"}
              {hasFee && (
                <span className="ml-0.5 text-xs font-medium text-[#8A6A1C]">
                  {FEE_UNIT}
                </span>
              )}
            </p>
          </div>

          {showMemberYear && (
            <div className="rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] px-3.5 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#475569]">
                Member Since
              </p>
              <p
                className="mt-1 text-2xl font-bold leading-none text-[#14213D]"
                style={headingFont}
              >
                {memberYear}
              </p>
            </div>
          )}
        </div>

        {/* CTA (আসল link ওপরের নামের stretched link) */}
        <div className="mt-auto pt-6">
          <span
            aria-hidden="true"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#14213D] py-3 text-sm font-semibold text-[#FBF6EA] transition-colors duration-300 group-hover:bg-[#E2B93B] group-hover:text-[#0B1526]"
          >
            View Profile
            <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </span>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   LOADING SKELETON
   ============================================================ */
function SkeletonGrid() {
  const bar = "rounded-md bg-[#E1E8F2] motion-safe:animate-pulse";

  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-2xl border border-[#DCE3EE] bg-white p-6 shadow-[0_4px_16px_rgba(20,33,61,0.06)]"
        >
          <div className="flex items-start gap-4">
            <div className="h-[76px] w-[76px] shrink-0 rounded-full bg-[#E1E8F2] motion-safe:animate-pulse" />
            <div className="flex-1 pt-1">
              <div className={`${bar} h-5 w-3/4`} />
              <div className={`${bar} mt-3 h-6 w-1/2 !rounded-full`} />
              <div className={`${bar} mt-3 h-6 w-2/5 !rounded-full`} />
            </div>
          </div>

          <div className="my-5 h-px bg-[#E6ECF5]" />

          <div className={`${bar} h-3.5 w-full`} />
          <div className={`${bar} mt-2.5 h-3.5 w-4/5`} />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className={`${bar} h-[74px] !rounded-xl`} />
            <div className={`${bar} h-[74px] !rounded-xl`} />
          </div>

          <div className={`${bar} mt-6 h-11 !rounded-xl`} />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ hasFilters, onClear }) {
  return (
    <div
      role="status"
      className="mx-auto max-w-md rounded-2xl border border-dashed border-[#B9C5D8] bg-white px-6 py-16 text-center shadow-[0_4px_16px_rgba(20,33,61,0.05)]"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14213D] text-2xl text-[#E2B93B]">
        <FaScaleBalanced aria-hidden="true" />
      </div>

      <h3
        className="mt-6 text-2xl font-bold tracking-[-0.01em] text-[#14213D]"
        style={headingFont}
      >
        No lawyers found
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#475569]">
        {hasFilters
          ? "Try adjusting your filters or searching with a different name."
          : "There are no lawyers to show right now. Please check back soon."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className={`mt-6 inline-flex items-center rounded-xl bg-[#14213D] px-5 py-3 text-sm font-semibold text-[#FBF6EA] transition-colors duration-200 hover:bg-[#1E3160] ${focusRing}`}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}