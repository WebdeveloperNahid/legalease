"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { createHiringRequest } from "@/lib/actions/hiring";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCircleCheck,
  FaCircleXmark,
  FaClock,
  FaLock,
  FaRotate,
  FaSpinner,
  FaShieldHalved,
} from "react-icons/fa6";

/* ---------- Config ---------- */
const CURRENCY = "$"; // Browse card-এর সাথে একই রাখুন
const DASHBOARD_ROUTE = "/dashboard/user";
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

const btnBase = `inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${focusRing}`;
const btnGold = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(226,185,59,0.5)] disabled:hover:translate-y-0`;
const btnOutline = `${btnBase} border border-[#0B1526]/25 bg-white text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]`;

const STEPS = ["Request", "Review", "Payment"];

const STATUS_UI = {
  pending: {
    icon: FaClock,
    title: "Waiting for the lawyer",
    text: "Your request is under review. You can pay as soon as the lawyer accepts it.",
    box: "border-[#F3D9A4] bg-[#FFF7E6] text-[#92400E]",
  },
  accepted: {
    icon: FaCircleCheck,
    title: "Request accepted",
    text: "Great news! The lawyer accepted your request. Complete the payment to proceed.",
    box: "border-[#B7E4C7] bg-[#ECFDF3] text-[#166534]",
  },
  rejected: {
    icon: FaCircleXmark,
    title: "Request declined",
    text: "The lawyer could not take your case this time. You can browse other lawyers.",
    box: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]",
  },
};

/* ---------- Stepper (গাঢ় hero-র উপরে) ---------- */
function Stepper({ current }) {
  return (
    <ol aria-label="Hiring progress" className="flex max-w-md items-start">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={`flex items-start ${i < STEPS.length - 1 ? "flex-1" : ""}`}
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  done
                    ? "bg-[#E2B93B] text-[#0B1526]"
                    : active
                    ? "bg-[#FBF6EA] text-[#0B1526] ring-4 ring-[#E2B93B]/40"
                    : "border border-[#FBF6EA]/30 text-[#FBF6EA]/70"
                }`}
              >
                {done ? <FaCheck aria-hidden="true" className="text-xs" /> : i + 1}
              </span>
              <span
                className={`text-xs font-semibold ${
                  active || done ? "text-[#FBF6EA]" : "text-[#FBF6EA]/60"
                }`}
              >
                {label}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={`mx-2 mt-[18px] h-0.5 flex-1 rounded-full ${
                  done ? "bg-[#E2B93B]" : "bg-[#FBF6EA]/20"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Main ---------- */
export default function HiringRequestClient({
  lawyerHiringInfo,
  ClientUser,
  existingRequest,
  backHref = BROWSE_ROUTE,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(
    existingRequest?.status ? String(existingRequest.status).toLowerCase() : null
  );
  const [imgFailed, setImgFailed] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();

  useEffect(() => {
    if (existingRequest?.status) {
      setStatus(String(existingRequest.status).toLowerCase());
    }
  }, [existingRequest]);

  const name = lawyerHiringInfo?.name?.trim() || "this lawyer";
  const specialization = lawyerHiringInfo?.specialization || "Legal Counsel";
  const photo =
    lawyerHiringInfo?.image || lawyerHiringInfo?.photo || lawyerHiringInfo?.imageUrl;
  const showPhoto = photo && !imgFailed;
  const rawFee = lawyerHiringInfo?.fee;
  const hasFee = rawFee !== undefined && rawFee !== null && rawFee !== "";
  const feeText = hasFee ? `${CURRENCY}${rawFee}` : "On request";

  const ui = status ? STATUS_UI[status] : null;
  const stepIndex = !status ? 0 : status === "accepted" ? 2 : 1;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await createHiringRequest({
        lawyerId: lawyerHiringInfo?.lawyerId,
        lawyerName: lawyerHiringInfo?.name,
        specialization: lawyerHiringInfo?.specialization,
        fee: lawyerHiringInfo?.fee,
        userId: ClientUser?.id,
        userName: ClientUser?.name,
        userEmail: ClientUser?.email,
      });

      if (result) {
        setStatus("pending");
        toast.success("Request sent to the lawyer");
      } else {
        setError("Failed to send request. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => startRefresh(() => router.refresh());

  return (
    <div className="bg-[#F3F6FB]">
      {/* ================= Hero band ================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] pb-28 pt-8 sm:pb-32 sm:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-[#E2B93B]/15 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2B93B]/80 to-transparent"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            href={backHref}
            className={`inline-flex items-center gap-2 rounded-lg text-sm font-medium text-[#E8DCC8] transition-colors hover:text-[#F3D98B] ${focusRing}`}
          >
            <FaArrowLeft aria-hidden="true" className="text-xs" />
            Back to lawyer profile
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
              Hiring request
            </span>
          </div>

          <h1
            className="mt-3 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            {status ? "Request Status" : "Confirm Your Request"}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#E8DCC8] sm:text-base">
            {status
              ? "Follow your request here. Payment opens once the lawyer accepts."
              : "Review the details below, then send your hiring request. No payment is taken now."}
          </p>

          {status !== "rejected" && (
            <div className="mt-8">
              <Stepper current={stepIndex} />
            </div>
          )}
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="relative mx-auto -mt-20 max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
          {/* ---------- Lawyer summary ---------- */}
          <aside className="order-1 lg:order-2 lg:col-span-2 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#E2B93B]/30 bg-gradient-to-b from-[#14213D] to-[#0B1526] shadow-[0_20px_50px_rgba(11,21,38,0.35)]">
              <div className="flex items-center gap-4 p-5 lg:block lg:p-6">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[2px] lg:h-auto lg:w-full lg:p-[3px]">
                  <div className="h-full w-full overflow-hidden rounded-[14px] bg-[#0B1526] lg:aspect-square lg:rounded-2xl">
                    {showPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={`${name}, ${specialization}`}
                        referrerPolicy="no-referrer"
                        onError={() => setImgFailed(true)}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#E2B93B] lg:text-7xl"
                        style={headingFont}
                      >
                        {name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0 lg:mt-5">
                  <span className="inline-flex max-w-full items-center gap-2 truncate rounded-full border border-[#E2B93B]/40 bg-[#E2B93B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F3D98B]">
                    {specialization}
                  </span>
                  <p
                    className="mt-2 truncate text-xl font-bold capitalize text-[#FBF6EA] sm:text-2xl"
                    style={headingFont}
                  >
                    {name}
                  </p>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3 border-t border-[#FBF6EA]/10 bg-[#0B1526]/60 px-5 py-4 lg:px-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#E8DCC8]/70">
                    Consultation fee
                  </p>
                  <p
                    className="mt-0.5 text-3xl font-bold text-[#F3D98B]"
                    style={headingFont}
                  >
                    {feeText}
                    {hasFee && (
                      <span className="ml-1 text-sm font-medium text-[#E8DCC8]/70">/hr</span>
                    )}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-[#E8DCC8]/80">
                  <FaShieldHalved aria-hidden="true" className="text-[#E2B93B]" />
                  Secure Stripe payment
                </span>
              </div>
            </div>
          </aside>

          {/* ---------- Action card ---------- */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_16px_44px_rgba(11,21,38,0.12)]">
              <div className="space-y-6 p-6 sm:p-8">
                {/* ----- Status card ----- */}
                {ui && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-xl border p-5 ${ui.box}`}
                  >
                    <div className="flex items-start gap-3">
                      <ui.icon aria-hidden="true" className="mt-0.5 shrink-0 text-xl" />
                      <div>
                        <p className="text-base font-bold">{ui.title}</p>
                        <p className="mt-1 text-sm leading-relaxed">{ui.text}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----- Payment (accepted) ----- */}
                {status === "accepted" && (
                  <div className="rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                      Amount to pay
                    </p>
                    <p
                      className="mt-0.5 text-3xl font-bold text-[#0B1526]"
                      style={headingFont}
                    >
                      {feeText}
                    </p>

                    {existingRequest?._id && (
                      <Link
                        href={`/payments/${existingRequest._id}`}
                        className={`${btnGold} mt-5`}
                      >
                        Pay {feeText}
                        <FaArrowRight aria-hidden="true" className="text-xs" />
                      </Link>
                    )}

                    <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                      <FaLock aria-hidden="true" className="text-[11px]" />
                      Secure checkout powered by Stripe
                    </p>
                  </div>
                )}

                {/* ----- Not sent yet ----- */}
                {!status && (
                  <>
                    <div>
                      <h2
                        className="text-xl font-bold text-[#0B1526]"
                        style={headingFont}
                      >
                        What happens next
                      </h2>
                      <ol className="mt-4 space-y-4">
                        {[
                          ["Send your request", "It goes straight to the lawyer."],
                          ["The lawyer reviews it", "They accept or decline your case."],
                          ["Pay after acceptance", "You are charged only if it is accepted."],
                        ].map(([title, text], i) => (
                          <li key={title} className="flex items-start gap-4">
                            <span
                              aria-hidden="true"
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E2B93B]/60 bg-[#E2B93B]/10 text-sm font-bold text-[#8A6A1C]"
                            >
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-[#0B1526]">{title}</p>
                              <p className="mt-0.5 text-sm text-slate-600">{text}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {error && (
                      <p
                        role="alert"
                        className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-center text-sm font-medium text-[#991B1B]"
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={loading}
                      aria-busy={loading}
                      className={btnGold}
                    >
                      {loading ? (
                        <>
                          <FaSpinner
                            aria-hidden="true"
                            className="animate-spin text-sm motion-reduce:animate-none"
                          />
                          Sending request...
                        </>
                      ) : (
                        <>
                          Confirm & Send Request
                          <FaArrowRight aria-hidden="true" className="text-xs" />
                        </>
                      )}
                    </button>
                  </>
                )}

                {/* ----- Actions per state ----- */}
                {status === "pending" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      aria-busy={isRefreshing}
                      className={btnOutline}
                    >
                      <FaRotate
                        aria-hidden="true"
                        className={`text-xs ${
                          isRefreshing ? "animate-spin motion-reduce:animate-none" : ""
                        }`}
                      />
                      {isRefreshing ? "Checking..." : "Refresh status"}
                    </button>
                    <Link href={DASHBOARD_ROUTE} className={btnOutline}>
                      Go to dashboard
                    </Link>
                  </div>
                )}

                {status === "rejected" && (
                  <Link href={BROWSE_ROUTE} className={btnOutline}>
                    Browse other lawyers
                    <FaArrowRight aria-hidden="true" className="text-xs" />
                  </Link>
                )}

                {status === "accepted" && (
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    aria-busy={isRefreshing}
                    className={`mx-auto flex items-center gap-2 rounded-lg text-xs font-medium text-slate-500 underline-offset-2 hover:text-[#0B1526] hover:underline ${focusRing}`}
                  >
                    <FaRotate
                      aria-hidden="true"
                      className={`text-[11px] ${
                        isRefreshing ? "animate-spin motion-reduce:animate-none" : ""
                      }`}
                    />
                    Refresh status
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}