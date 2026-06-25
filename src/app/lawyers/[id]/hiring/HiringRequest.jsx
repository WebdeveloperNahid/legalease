"use client";

import { useState } from "react";
import { createHiringRequest } from "@/lib/api/hiring";

export default function HiringRequestClient({ lawyerHiringInfo, ClientUser, existingRequest }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // যদি existingRequest থাকে তবে সেটি সেট হবে, নাহলে null
  const [status, setStatus] = useState(existingRequest?.status || null);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await createHiringRequest({
        lawyerId: lawyerHiringInfo._id,
        lawyerName: lawyerHiringInfo.name,
        specialization: lawyerHiringInfo.specialization,
        fee: lawyerHiringInfo.fee,
        userId: ClientUser.id,
        userName: ClientUser.name,
        userEmail: ClientUser.email,
      });

      if (result) {
        setStatus("pending");
      } else {
        setError("Failed to send request. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[24px] border border-[#f0f0f0] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          {/* গোল্ডেন/অলিভ গ্র্যাডিয়েন্ট টপ বার */}
          <div className="h-2 w-full bg-gradient-to-r from-[#FFD500] to-[#AF8752]" />

          <div className="p-8">
            <h2 className="mb-2 font-[Georgia,_serif] text-2xl font-extrabold text-[#11100C]">
              {status ? "Request Status" : "Confirm Hiring Request"}
            </h2>

            {/* স্ট্যাটাস ডিসপ্লে - রিকোয়েস্ট পাঠানো হলে দেখাবে */}
            {status ? (
              <div className="my-6 rounded-xl border border-[#f0ecd0] bg-[#fffcf0] p-6 text-center">
                <p className="text-xs font-extrabold uppercase tracking-[2px] text-[#AF8752]">Current Status</p>
                <p className="mt-2 text-lg font-bold text-[#11100C] capitalize">{status}</p>
                <p className="mt-1 text-sm text-[#6b6b6b]">
                  {status === "pending" && "Your request is currently under review by the lawyer."}
                  {status === "rejected" && "We are sorry, your request has been declined."}
                </p>
              </div>
            ) : (
              <p className="mb-6 text-sm text-[#6b6b6b]">
                You are about to send a hiring request to{" "}
                <span className="font-bold text-[#AF8752]">{lawyerHiringInfo.name}</span>.
              </p>
            )}

            {/* পেমেন্ট বক্স - শুধু একসেপ্ট হলে আসবে */}
            {status === "accepted" && (
              <div className="my-6 rounded-xl border border-[#AF8752] bg-[#fdfaf5] p-5 text-center">
                <h3 className="font-bold text-[#11100C]">Payment Required</h3>
                <p className="mb-4 text-xs text-[#6b6b6b]">Complete payment to proceed further.</p>
                <button className="w-full rounded-lg bg-[#AF8752] py-3 text-[12px] font-extrabold uppercase tracking-[1.5px] text-white hover:bg-[#8e6d42]">
                  Pay ${lawyerHiringInfo.fee}
                </button>
              </div>
            )}

            {/* ইনফরমেশন কার্ড - স্ট্যাটাস না থাকলে দেখাবে */}
            {!status && (
              <>
                <div className="mb-6 rounded-xl border border-[#f4f4f4] bg-[#fafafa] p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-[#9b9b9b]">Specialization</span>
                    <span className="font-bold text-[#11100C]">{lawyerHiringInfo.specialization}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9b9b9b]">Consultation Fee</span>
                    <span className="font-bold text-[#11100C]">${lawyerHiringInfo.fee}/hr</span>
                  </div>
                </div>

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full rounded-xl bg-[#11100C] px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-[1.5px] text-white transition hover:bg-[#AF8752] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Confirm & Send Request"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}