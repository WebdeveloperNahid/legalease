"use client";

import { useState } from "react";
import Link from "next/link";

export default function LawyerDetailsClient({ lawyer }) {
  const [showHireModal, setShowHireModal] = useState(false);
  const isBusy = lawyer?.status === "Busy";

  if (!lawyer) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      <div className="mx-auto max-w-[900px]">
        {/* Back Link */}
        <Link
          href="/browse-lawyers"
          className="mb-8 block text-[13px] font-bold text-[#AF8752] hover:underline"
        >
          ← Back to Browse
        </Link>

        {/* --- Main Card --- */}
        <div className="overflow-hidden rounded-[24px] border border-[#f0f0f0] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <div className="h-2 w-full bg-gradient-to-r from-[#FFD500] to-[#AF8752]" />

          <div className="p-8 md:p-10">
            {/* Header: Photo + Name + Action */}
            <div className="flex flex-col gap-8 md:flex-row">
              <img
                src={
                  lawyer.image || "https://i.ibb.co/4ZQZ6q0/default-avatar.png"
                }
                alt={lawyer.name}
                className="h-32 w-32 shrink-0 rounded-full border-4 border-[#f8f7f4] object-cover shadow-lg"
              />

              <div className="flex flex-1 flex-col justify-center">
                <span className="mb-2 w-fit rounded-full border border-[#AF8752]/20 bg-[#AF8752]/[0.08] px-4 py-1 text-[10px] font-extrabold uppercase tracking-[2px] text-[#AF8752]">
                  {lawyer.specialty || "Legal Expert"}
                </span>
                <h1 className="mb-2 font-[Georgia,_serif] text-[32px] font-extrabold text-[#11100C]">
                  {lawyer.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-[13px]">
                  <span
                    className={`flex items-center gap-2 font-bold ${isBusy ? "text-red-500" : "text-green-600"}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${isBusy ? "bg-red-500" : "bg-green-600"}`}
                    />
                    {isBusy ? "Busy" : "Available for Consultation"}
                  </span>
                  <span className="text-[#9b9b9b]">•</span>
                  <span className="text-[#6b6b6b]">
                    Joined {new Date(lawyer?.createdAt).getFullYear()}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-col justify-center gap-3">
                <div className="rounded-xl border border-[#FFD500]/30 bg-amber-50 px-6 py-3 text-center">
                  <p className="text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#AF8752]">
                    Consultation Fee
                  </p>
                  <p className="text-2xl font-extrabold">
                    ${lawyer.fee}
                    <span className="text-sm">/hr</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowHireModal(true)}
                  className="rounded-xl bg-[#11100C] px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-[1.5px] text-white transition hover:bg-[#FFD500] hover:text-black"
                >
                  Send Hiring Request
                </button>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mt-10 border-t border-[#f4f4f4] pt-8">
              <h3 className="mb-4 text-[17px] font-bold text-[#cfab0a]">
                Professional Summary
              </h3>
              <p className="leading-[1.8] text-[#97329b]">{lawyer.bio}</p>
            </div>

            {/* Info Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Specialization", val: lawyer.specialization },
                { label: "Consultation Fee", val: `$${lawyer.fee}/hr` },
                { label: "Availability", val: lawyer.status },
                {
                  label: "Member Since",
                  val: lawyer?.createdAt
                    ? new Date(lawyer.createdAt).getFullYear()
                    : "aita bakend thke astase na kno",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#f4f4f4] bg-[#fafafa] p-4 text-center"
                >
                  <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[1.5px] text-[#9ebb1f]">
                    {item.label}
                  </p>
                  <p className="font-bold text-[#11100C]">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Reviews Section */}
        {/* <div className="mt-8 rounded-[24px] border border-[#f0f0f0] bg-white p-8 md:p-10">
          <h3 className="mb-6 text-[17px] font-bold text-[#11100C]">
            Client Reviews
          </h3>
          <textarea
            className="mb-4 h-32 w-full rounded-xl border border-[#e8e8e8] p-4 text-[13px] outline-none focus:border-[#AF8752]"
            placeholder="Write your review about this lawyer..."
          />
          <button className="rounded-xl bg-[#FFD500] px-8 py-3 text-[12px] font-extrabold uppercase tracking-[1.5px] text-black transition hover:bg-[#AF8752] hover:text-white">
            Post Review
          </button>
          <p className="mt-4 text-[11px] text-[#9b9b9b]">
            Only verified clients who hire this lawyer will be able to submit
            reviews.
          </p>
        </div> */}
      </div>

      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-3 text-xl font-bold text-[#11100C]">
              Send Hiring Request
            </h2>

            <p className="mb-6 text-sm text-yellow-700">
              Are you sure you want to hire
              <span className="font-bold text-[#13f013]"> {lawyer.name}</span>?
            </p>

            <div className="mb-6 rounded-xl bg-[#fafafa] p-4">
              <p className="text-xs text-gray-500">Lawyer Fee</p>

              <p className="text-xl font-bold">${lawyer.fee}/hr</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowHireModal(false)}
                className="flex-1 rounded-xl border py-3 text-sm font-bold"
              >
                Cancel
              </button>

              <Link
                // href={`lawyers/${lawyer_id}/hiring`}
                 href={`/lawyers/${lawyer._id}/hiring`}
                // onClick={() => {
                //   setShowHireModal(false);

                //   // এখানে পরে API call হবে
                //   // create hiring request
                // }}
                className="flex-1 rounded-xl bg-black py-3 text-sm font-bold text-white text-center"
              >
                Confirm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
