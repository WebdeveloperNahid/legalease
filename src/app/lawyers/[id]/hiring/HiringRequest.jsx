"use client";

import { createHiringRequest } from "@/lib/actions/hiring";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HiringRequestClient({
  lawyerHiringInfo,
  ClientUser,
  existingRequest,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(existingRequest?.status || null);

  useEffect(() => {
    if (existingRequest?.status) {
      setStatus(existingRequest.status?.toLowerCase());
    }
  }, [existingRequest]);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await createHiringRequest({
        lawyerId: lawyerHiringInfo?._id,
        lawyerName: lawyerHiringInfo?.name,
        specialization: lawyerHiringInfo?.specialization,
        fee: lawyerHiringInfo?.fee,
        userId: ClientUser?.id,
        userName: ClientUser?.name,
        userEmail: ClientUser?.email,
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

  // স্ট্যাটাস অনুযায়ী ডাইনামিক কালার 
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[24px] border border-[#f0f0f0] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <div className="h-2 w-full bg-gradient-to-r from-[#FFD500] to-[#AF8752]" />

          <div className="p-8">
            <h2 className="mb-6 font-[Georgia,_serif] text-2xl font-extrabold text-[#11100C]">
              {status ? "Request Status" : "Confirm Hiring Request"}
            </h2>

            {/* স্ট্যাটাস কার্ড */}
            {status ? (
              <div
                className={`my-6 rounded-xl border p-6 text-center ${getStatusColor()}`}
              >
                <p className="text-xs font-extrabold uppercase tracking-[2px] opacity-70">
                  Current Status
                </p>
                <p className="mt-2 text-xl font-bold capitalize">{status}</p>
                <p className="mt-2 text-sm font-medium">
                  {status === "pending" &&
                    "Your request is under review by the lawyer."}
                  {status === "accepted" &&
                    "Congratulations! Your request has been accepted."}
                  {status === "rejected" &&
                    "We are sorry, your request has been declined."}
                </p>
                <button
                  onClick={() => router.refresh()}
                  className="mt-4 text-[10px] underline hover:opacity-80 uppercase"
                >
                  Refresh Status
                </button>
              </div>
            ) : (
              <p className="mb-6 text-sm text-[#6b6b6b]">
                You are about to send a hiring request to{" "}
                <span className="font-bold text-[#AF8752]">
                  {lawyerHiringInfo.name}
                </span>
                .
              </p>
            )}

            {/* পেমেন্ট বক্স */}
            {status === "accepted" && (
              <div className="my-6 rounded-2xl border-2 border-[#AF8752] bg-[#fdfaf5] p-6 text-center shadow-sm">
                <h3 className="text-lg font-bold text-[#11100C]">
                  Payment Required
                </h3>
                <p className="mb-6 text-sm text-[#6b6b6b]">
                  Complete payment to proceed further.
                </p>
                <Link href={`/payments/${existingRequest._id}`} className="w-full rounded-xl bg-[#AF8752] py-4 text-[14px] font-extrabold uppercase tracking-[2px] text-white hover:bg-[#8e6d42] transition-all transform hover:scale-[1.02] px-3 py2">
                  Pay ${lawyerHiringInfo.fee}
                </Link>
              </div>
            )}

            {/* ইনফরমেশন কার্ড */}
            {!status && (
              <>
                <div className="mb-8 rounded-xl border border-[#f4f4f4] bg-[#fafafa] p-5">
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="text-[#9b9b9b]">Specialization</span>
                    <span className="font-bold text-[#11100C]">
                      {lawyerHiringInfo.specialization}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9b9b9b]">Consultation Fee</span>
                    <span className="font-bold text-[#11100C]">
                      ${lawyerHiringInfo.fee}/hr
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="mb-4 text-sm text-red-600 text-center">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#11100C] px-6 py-4 text-[14px] font-extrabold uppercase tracking-[2px] text-white transition hover:bg-[#AF8752] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending Request..." : "Confirm & Send Request"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
