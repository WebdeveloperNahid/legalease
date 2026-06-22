"use client";

import { useState } from "react";
import Link from "next/link";

export default function LawyerDetailsClient({ lawyer }) {
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireLoading, setHireLoading] = useState(false);
  const [hireSuccess, setHireSuccess] = useState(false);
  const [hireError, setHireError] = useState("");

  // TODO: replace with useSession() from your auth-client
  const user = null; // null = not logged in
  const isLoggedIn = !!user;
  const isUser = user?.role === "user";

  const isBusy = lawyer.status === "Busy";

  const joinedYear = lawyer.createdAt
    ? new Date(lawyer.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "2024";

  // ── Hire Submit ─────────────────────────────────────
  const handleHireSubmit = async () => {
    setHireLoading(true);
    setHireError("");
    try {
      // ═══════════════════════════════════════════════
      // TODO: BACKEND — hire request পাঠানোর সময়
      // এই comment সরিয়ে নিচের code বসাও:
      //
      // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hirings`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     lawyerId: lawyer._id,
      //     lawyerName: lawyer.name,
      //     lawyerEmail: lawyer.email,
      //     clientEmail: user.email,
      //     clientName: user.name,
      //     fee: lawyer.fee,
      //     status: "pending",
      //     hiredAt: new Date(),
      //   }),
      // });
      // if (!res.ok) throw new Error("Failed to send hire request");
      // ═══════════════════════════════════════════════

      // temporary success simulation
      await new Promise((r) => setTimeout(r, 1200));
      setHireSuccess(true);
    } catch (err) {
      setHireError(err.message || "Something went wrong.");
    } finally {
      setHireLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f7f4] min-h-screen px-6 py-12 font-sans">
      <div className="max-w-[900px] mx-auto">
        {/* ── Back link ───────────────────────────────── */}
        <Link
          href="/browse-lawyers"
          className="inline-flex items-center gap-1.5 text-[#AF8752] text-[13px] font-semibold no-underline mb-8 tracking-[0.5px]"
        >
          ← Back to Browse
        </Link>

        {/* ══════════════════════════════════════════════
            MAIN PROFILE CARD
        ══════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.07)] border-[1.5px] border-[#f0f0f0] overflow-hidden">
          {/* Gold top bar */}
          <div className="h-[5px] bg-gradient-to-r from-[#FFD500] via-[#AF8752] to-[#FFD500]" />

          <div className="px-10 pt-10 pb-9">
            {/* ── Hero Section ──────────────────────────── */}
            <div className="flex gap-9 items-start flex-wrap mb-9">
              {/* Photo */}
              <div className="flex-shrink-0 p-1 rounded-full bg-gradient-to-br from-[#FFD500] to-[#AF8752]">
                <img
                  src={
                    lawyer.image ||
                    "https://i.ibb.co/4ZQZ6q0/default-avatar.png"
                  }
                  alt={lawyer.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white block"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-[240px]">
                {/* Specialization tag */}
                <span className="inline-block bg-[rgba(175,135,82,0.08)] border border-[rgba(175,135,82,0.3)] text-[#AF8752] text-[10px] font-extrabold tracking-[2px] uppercase px-3.5 py-[5px] rounded-full mb-3">
                  ⚖{" "}
                  {lawyer.specialization || lawyer.specialty || "Legal Expert"}
                </span>

                {/* Name */}
                <h1 className="text-[#11100C] text-[clamp(24px,4vw,36px)] font-extrabold mt-0 mb-3 font-serif leading-[1.2]">
                  {lawyer.name}
                </h1>

                {/* Status + Date joined row */}
                <div className="flex items-center gap-3 flex-wrap mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-[5px] rounded-full border ${
                      isBusy
                        ? "text-[#dc2626] bg-[#fef2f2] border-[#fecaca]"
                        : "text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isBusy ? "bg-[#dc2626]" : "bg-[#16a34a]"
                      }`}
                    />
                    {isBusy ? "Currently Busy" : "Available for Consultation"}
                  </span>

                  <span className="text-[#9b9b9b] text-xs flex items-center gap-[5px]">
                    📅 Joined {joinedYear}
                  </span>
                </div>

                {/* Fee */}
                <div className="inline-flex items-baseline gap-1 bg-[#fffbeb] border border-[rgba(255,213,0,0.4)] rounded-[14px] px-5 py-2.5 mb-6">
                  <span className="text-[#AF8752] text-xs font-bold">
                    Consultation Fee
                  </span>
                  <span className="text-[#11100C] text-[28px] font-extrabold ml-2">
                    ${lawyer.fee}
                  </span>
                  <span className="text-[#AF8752] text-xs">/hr</span>
                </div>

                {/* Hire Button */}
                {/* Book Consultation Button */}
                {!isBusy ? (
                  <button
                    onClick={() => setShowHireModal(true)}
                    className="bg-[#FFD500] hover:bg-[#AF8752] text-[#11100C] hover:text-white font-extrabold text-[13px] tracking-[1.5px] uppercase px-2 py-3.5 rounded-xl border-none cursor-pointer shadow-[0_4px_16px_rgba(255,213,0,0.3)] transition-all duration-200"
                  >
                    📅 Book Consultation
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-[#f0f0f0] text-[#9b9b9b] font-bold text-[13px] px-9 py-3.5 rounded-xl border-none cursor-not-allowed tracking-[1px] uppercase"
                  >
                    Currently Unavailable
                  </button>
                )}
              </div>
            </div>

            {/* ── Divider ───────────────────────────────── */}
            <div className="h-px bg-[#f0f0f0] mt-0 mb-8" />

            {/* ── Bio Section ───────────────────────────── */}
            <div className="mb-9">
              <h2 className="text-[#11100C] text-base font-extrabold mt-0 mb-3.5 tracking-[0.5px] flex items-center gap-2">
                <span className="w-1 h-5 bg-[#FFD500] rounded-sm inline-block" />
                Professional Summary
              </h2>
              <p className="text-[#4b4b4b] text-[15px] leading-[1.85] m-0 bg-[#fafafa] rounded-[14px] px-6 py-5 border border-[#f0f0f0]">
                {lawyer.bio || "This lawyer has not provided a bio yet."}
              </p>
            </div>

            {/* ── Info Grid ─────────────────────────────── */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-9">
              {[
                {
                  label: "Specialization",
                  value: lawyer.specialization || lawyer.specialty || "—",
                  icon: "⚖",
                },
                {
                  label: "Consultation Fee",
                  value: `$${lawyer.fee}/hr`,
                  icon: "💰",
                },
                {
                  label: "Availability",
                  value: isBusy ? "Busy" : "Available",
                  icon: "📋",
                },
                { label: "Member Since", value: joinedYear, icon: "📅" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#fafafa] border border-[#f0f0f0] rounded-[14px] px-5 py-4"
                >
                  <p className="text-[#9b9b9b] text-[10px] font-bold tracking-[1.5px] uppercase mt-0 mb-1.5">
                    {item.icon} {item.label}
                  </p>
                  <p className="text-[#11100C] text-[15px] font-bold m-0">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Comment Section placeholder ───────────── */}
            <div>
              <h2 className="text-[#11100C] text-base font-extrabold mt-0 mb-3.5 tracking-[0.5px] flex items-center gap-2">
                <span className="w-1 h-5 bg-[#FFD500] rounded-sm inline-block" />
                Client Reviews
              </h2>
              <div className="bg-[#fafafa] border border-[#f0f0f0] rounded-[14px] p-6">
                <textarea
                  placeholder="Write your review about this lawyer..."
                  rows={5}
                  className="w-full p-3.5 border border-[#e5e5e5] rounded-xl resize-y text-sm outline-none box-border mb-3"
                />

                <button className="bg-[#FFD500] text-[#11100C] font-bold border-none rounded-[10px] px-6 py-3 cursor-pointer text-sm">
                  Post Review 
                </button>
                <p className="text-[#9b9b9b] text-xs mt-3 mb-0">
                  Only verified clients who hire this lawyer will be able to
                  submit reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          HIRE MODAL
      ══════════════════════════════════════════════ */}
      {showHireModal && (
        <div className="fixed inset-0 z-[100] bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-6">
          <div className="bg-white rounded-[20px] p-9 w-full max-w-[460px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] border-[1.5px] border-[#f0f0f0]">
            {/* Modal top bar */}
            <div className="h-1 bg-gradient-to-r from-[#FFD500] to-[#AF8752] rounded-sm mb-7" />

            {hireSuccess ? (
              /* ── Success State ──────────────────────── */
              <div className="text-center">
                <div className="text-[52px] mb-4">✅</div>
                <h3 className="text-[#16a34a] text-xl font-extrabold mt-0 mb-2.5">
                  Request Sent!
                </h3>
                <p className="text-[#6b6b6b] text-sm mt-0 mb-6">
                  Your hiring request has been sent to{" "}
                  <strong>{lawyer.name}</strong>. You will be notified once they
                  respond.
                </p>
                <button
                  onClick={() => {
                    setShowHireModal(false);
                    setHireSuccess(false);
                  }}
                  className="bg-[#FFD500] text-[#11100C] font-extrabold text-[13px] px-8 py-3 rounded-xl border-none cursor-pointer tracking-[1px] uppercase"
                >
                  Done
                </button>
              </div>
            ) : (
              /* ── Confirm State ──────────────────────── */
              <>
                <h3 className="text-[#11100C] text-xl font-extrabold mt-0 mb-1.5 font-serif">
                  Confirm Hire Request
                </h3>
                <p className="text-[#6b6b6b] text-[13px] mt-0 mb-6">
                  You are about to send a hiring request to this lawyer.
                </p>

                {/* Lawyer summary in modal */}
                <div className="flex gap-4 items-center bg-[#fafafa] rounded-[14px] px-5 py-4 mb-6 border border-[#f0f0f0]">
                  <img
                    src={
                      lawyer.image ||
                      "https://i.ibb.co/4ZQZ6q0/default-avatar.png"
                    }
                    alt={lawyer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#FFD500]"
                  />
                  <div>
                    <p className="text-[#11100C] font-bold text-[15px] mt-0 mb-1">
                      {lawyer.name}
                    </p>
                    <p className="text-[#AF8752] text-xs mt-0 mb-0.5 font-semibold">
                      {lawyer.specialization || lawyer.specialty}
                    </p>
                    <p className="text-[#6b6b6b] text-xs m-0">
                      Fee:{" "}
                      <strong className="text-[#11100C]">
                        ${lawyer.fee}/hr
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Error */}
                {hireError && (
                  <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-[10px] px-3.5 py-2.5 text-[13px] mb-4">
                    ⚠️ {hireError}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowHireModal(false);
                      setHireError("");
                    }}
                    disabled={hireLoading}
                    className="flex-1 bg-[#f4f4f4] text-[#6b6b6b] font-bold text-[13px] py-[13px] rounded-xl border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleHireSubmit}
                    disabled={hireLoading}
                    className={`flex-[2] text-[#11100C] font-extrabold text-[13px] tracking-[1px] uppercase py-[13px] rounded-xl border-none transition-colors duration-200 ${
                      hireLoading
                        ? "bg-[#8a7200] cursor-not-allowed"
                        : "bg-[#FFD500] cursor-pointer"
                    }`}
                  >
                    {hireLoading ? "⏳ Sending..." : "⚖ Confirm Hire"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
