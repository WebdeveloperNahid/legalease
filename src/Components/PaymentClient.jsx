"use client";

import { useState } from "react";
// import { createCheckoutSession } from "@/lib/actions/payment";
import Link from "next/link";

export default function PaymentClient({ hiringRequest }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayNow = async () => {
    setLoading(true);
    setError("");
    // const result = await createCheckoutSession(hiringRequest._id);
    // if (result?.url) {
    //   window.location.href = result.url;
    // } else {
    //   setError("পেমেন্ট সেশন তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      <div className="mx-auto max-w-md">
        <Link
          href="/dashboard/user/hiring-history"
          className="mb-6 inline-block text-[13px] font-bold text-[#AF8752] hover:underline"
        >
          ← Back to Hiring History
        </Link>

        <div className="overflow-hidden rounded-[28px] border border-[#f0f0f0] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          {/* Top accent bar */}
          <div className="h-2 w-full bg-gradient-to-r from-[#FFD500] to-[#AF8752]" />

          <div className="p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#AF8752]/10">
                <svg
                  className="h-7 w-7 text-[#AF8752]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="font-[Georgia,_serif] text-2xl font-extrabold text-[#11100C]">
                Complete Payment
              </h2>
              <p className="mt-1 text-[13px] text-[#9b9b9b]">
                Secure checkout powered by Stripe
              </p>
            </div>

            {/* Lawyer Info Row */}
            <div className="mb-3 flex items-center gap-4 rounded-2xl border border-[#f4f4f4] bg-[#fafafa] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#11100C] text-[14px] font-bold text-white">
                {hiringRequest.lawyerName?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9b9b9b]">
                  Lawyer
                </p>
                <p className="font-bold text-[#11100C]">
                  {hiringRequest.lawyerName}
                </p>
                <p className="text-[12px] text-[#6b6b6b]">
                  {hiringRequest.specialization}
                </p>
              </div>
            </div>

            {/* Client Info Row */}
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#f4f4f4] bg-[#fafafa] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#AF8752] text-[14px] font-bold text-white">
                {hiringRequest.userName?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9b9b9b]">
                  Billed To
                </p>
                <p className="font-bold text-[#11100C]">
                  {hiringRequest.userName}
                </p>
                <p className="text-[12px] text-[#6b6b6b]">
                  {hiringRequest.userEmail}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-6 border-t border-dashed border-[#e8e8e8]" />

            {/* Amount Section */}
            <div className="mb-8 flex items-end justify-between">
              <span className="text-[13px] font-bold text-[#6b6b6b]">
                Amount Payable
              </span>
              <span className="font-[Georgia,_serif] text-4xl font-extrabold text-[#11100C]">
                ${hiringRequest.fee}
              </span>
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Pay Button */}
            <form action="/api/checkout_sessions" method="POST">
            <input type="hidden" name="hiringRequest_Id" value={hiringRequest._id} />
              <section>
                <button type="submit" role="link" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#11100C] px-6 py-4 text-[14px] font-extrabold uppercase tracking-[2px] text-white transition hover:bg-[#AF8752] disabled:cursor-not-allowed disabled:opacity-50" >
                  Checkout
                </button>
              </section>
            </form>


            <p className="mt-4 text-center text-[11px] text-[#9b9b9b]">
              You will be redirected to Stripe is secure payment page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
