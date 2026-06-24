"use client";

import { getAllPublicLawyers } from "@/lib/api/add-lawyer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function BrowseLawyersContent() {
  const searchParams = useSearchParams();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState(searchParams?.get("specialty") || "");
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const data = await getAllPublicLawyers(search, specialty, availability);
        setLawyers(data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredData();
  }, [search, specialty, availability]);

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      {/* ── Page Header ───────────────────────────────── */}
      <div className="mx-auto mb-[52px] max-w-[600px] text-center">
        <span className="mb-[18px] inline-block rounded-full border border-[#AF8752]/25 bg-[#AF8752]/[0.08] px-4 py-[5px] text-[10px] font-extrabold uppercase tracking-[3px] text-[#AF8752]">
          ⚖ Verified Legal Network
        </span>
        <h1 className="mb-[14px] font-[Georgia,_serif] text-[clamp(28px,5vw,44px)] font-extrabold leading-[1.2] tracking-[-1px] text-[#11100C]">
          Find Your Legal Expert
        </h1>
        <div className="mx-auto mb-[18px] h-[3px] w-[52px] rounded-sm bg-gradient-to-r from-[#FFD500] to-[#AF8752]" />
        <p className="text-[15px] leading-[1.7] text-[#6b6b6b]">
          Browse verified legal professionals across all practice areas. Hire with confidence.
        </p>
      </div>

      {/* ── Search & Filter ───────────────────────────── */}
      <div className="mx-auto mb-[52px] grid max-w-[860px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 rounded-[18px] border border-[#ebebeb] bg-white p-5 px-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-[#AF8752]">🔍</span>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border-[1.5px] border-[#e8e8e8] bg-[#fafafa] py-[11px] pl-[38px] pr-3.5 text-[13px] text-[#11100C] outline-none transition-colors focus:border-[#AF8752]"
          />
        </div>

        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full cursor-pointer rounded-xl border-[1.5px] border-[#e8e8e8] bg-[#fafafa] px-3.5 py-[11px] text-[13px] text-[#11100C] outline-none"
        >
          <option value="">All Specializations</option>
          <option value="Criminal Law">Criminal Law</option>
          <option value="Corporate Law">Corporate Law</option>
          <option value="Family Law">Family Law</option>
          <option value="Tax Law">Tax Law</option>
          <option value="Civil Law">Civil Law</option>
          <option value="Immigration Law">Immigration Law</option>
          <option value="Real Estate Law">Real Estate Law</option>
          <option value="Labor Law">Labor Law</option>
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full cursor-pointer rounded-xl border-[1.5px] border-[#e8e8e8] bg-[#fafafa] px-3.5 py-[11px] text-[13px] text-[#11100C] outline-none"
        >
          <option value="">All Availability</option>
          <option value="Available">Available</option>
          <option value="Busy">Currently Busy</option>
        </select>
      </div>

      {/* ── Results Count ─────────────────────────────── */}
      {!loading && lawyers.length > 0 && (
        <div className="mx-auto mb-6 max-w-[1200px] pl-1">
          <p className="text-[13px] text-[#6b6b6b]">
            Showing <strong className="text-[#11100C]">{lawyers.length}</strong> legal professionals
          </p>
        </div>
      )}

      {/* ── Loading Skeleton ──────────────────────────── */}
      {loading ? (
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-[20px] border border-[#f0f0f0] bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-5 flex gap-4">
                <div className="h-20 w-20 shrink-0 rounded-full bg-[#f0f0f0]" />
                <div className="flex-1">
                  <div className="mb-2.5 h-4 rounded-md bg-[#f0f0f0]" />
                  <div className="h-3 w-[70%] rounded-md bg-[#f0f0f0]" />
                </div>
              </div>
              <div className="mb-2 h-3 rounded-md bg-[#f0f0f0]" />
              <div className="mb-5 h-3 w-[85%] rounded-md bg-[#f0f0f0]" />
              <div className="h-11 rounded-xl bg-[#f0f0f0]" />
            </div>
          ))}
        </div>
      ) : lawyers.length === 0 ? (
        /* ── Empty State ──────────────────────────────── */
        <div className="mx-auto max-w-[480px] rounded-[20px] border border-[#f0f0f0] bg-white px-6 py-20 text-center shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="mb-4 text-[52px]">⚖️</div>
          <h3 className="mb-2 text-[17px] font-bold text-[#11100C]">No Lawyers Found</h3>
          <p className="text-[13px] text-[#9b9b9b]">Try adjusting your filters or search differently.</p>
        </div>
      ) : (
        /* ═══════════ PROFESSIONAL LAWYER CARDS ═══════════ */
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {lawyers.map((lawyer) => (
            <LawyerCard key={lawyer._id} lawyer={lawyer} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════ LAWYER CARD COMPONENT ══════════ */
function LawyerCard({ lawyer }) {
  const isBusy = lawyer.availability?.toLowerCase()=== "busy";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[20px] border-[1.5px] border-[#f0f0f0] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FFD500] hover:shadow-[0_16px_48px_rgba(255,213,0,0.12),0_4px_16px_rgba(0,0,0,0.06)]">
      {/* gold top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#AF8752] to-[#FFD500] transition-[background] duration-300 group-hover:from-[#FFD500] group-hover:to-[#AF8752]" />

      <div className="px-6 pb-5 pt-6">
        {/* ── Header: Photo + Name + Status ─────────────── */}
        <div className="mb-[18px] flex items-start gap-4">
          <div className="relative shrink-0 rounded-full bg-gradient-to-br from-[#e8e8e8] to-[#d0d0d0] p-[3px] transition-[background] duration-300 group-hover:from-[#FFD500] group-hover:to-[#AF8752]">
            <img
              src={lawyer.image || "https://i.ibb.co/4ZQZ6q0/default-avatar.png"}
              alt={lawyer.name}
              className="block h-[76px] w-[76px] rounded-full border-[3px] border-white object-cover"
            />
            <span
              className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-[2.5px] border-white ${
                isBusy ? "bg-red-500" : "bg-green-500"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="mb-1.5 truncate font-[Georgia,_serif] text-[17px] font-extrabold leading-tight text-[#11100C]">
              {lawyer.name}
            </h3>

            <span className="mb-2 inline-block rounded-full border border-[#AF8752]/25 bg-[#AF8752]/[0.08] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#AF8752]">
              {lawyer.specialization || lawyer.specialty || "Legal Expert"}
            </span>

            <div>
              <span
                className={`inline-flex items-center gap-[5px] rounded-full border px-2.5 py-[3px] text-[11px] font-semibold ${
                  isBusy
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-green-200 bg-green-50 text-green-600"
                }`}
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${isBusy ? "bg-red-600" : "bg-green-600"}`} />
                {isBusy ? "Currently Busy" : "Available Now"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 h-px bg-[#f4f4f4]" />

        <p className="mb-[18px] line-clamp-2 min-h-[46px] text-[13px] leading-[1.75] text-[#6b6b6b]">
          {lawyer.bio ||
            "Experienced legal professional committed to delivering expert, results-driven counsel for every client."}
        </p>

        <div className="mb-5 flex gap-3">
          <div className="flex-1 rounded-xl border border-[#FFD500]/35 bg-amber-50 px-3.5 py-3 text-center">
            <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#AF8752]">
              Consultation Fee
            </p>
            <p className="text-[22px] font-extrabold leading-none text-[#11100C]">
              ${lawyer.fee}
              <span className="text-[11px] font-medium text-[#AF8752]">/hr</span>
            </p>
          </div>

          <div className="flex-1 rounded-xl border border-[#efefef] bg-[#f9f9f9] px-3.5 py-3 text-center">
            <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#9b9b9b]">
              Member Since
            </p>
            <p className="text-[22px] font-extrabold leading-none text-[#11100C]">
              {lawyer.createdAt ? new Date(lawyer.createdAt).getFullYear() : "2024"}
            </p>
          </div>
        </div>

        <Link
          href={`/lawyers/${lawyer._id}`}
          className="block rounded-xl border-2 border-transparent bg-[#11100C] py-3.5 text-center text-[12px] font-extrabold uppercase tracking-[1.5px] text-white transition-all duration-300 group-hover:bg-[#FFD500] group-hover:text-[#11100C]"
        >
          <span className="hidden group-hover:inline">⚖ View Full Profile →</span>
          <span className="inline group-hover:hidden">View Profile</span>
        </Link>
      </div>
    </div>
  );
}

export default function BrowseLawyers() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4] p-20 text-sm text-[#AF8752]">
          Loading legal experts...
        </div>
      }
    >
      <BrowseLawyersContent />
    </Suspense>
  );
}
