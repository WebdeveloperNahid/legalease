// import Link from "next/link";
import {
  BiBadgeCheck,
 
  BiSolidBadgeCheck,
} from "react-icons/bi";

import {  BsShieldCheck } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
import { LuBadgeCheck } from "react-icons/lu";

export default function PublishingPaymentCard() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[#AF8752]/20 bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#166534] px-8 py-10 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-3">
              <BsShieldCheck className="h-8 w-8 text-[#F8E7C2]" />
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                Complete Lawyer Verification
              </h2>

              <p className="mt-2 text-sm text-gray-100">
                Verify your account with a one-time publishing payment to
                activate your legal profile.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-8 p-8">
          <div className="rounded-2xl border border-[#AF8752]/20 bg-[#F9FAFB] p-6">
            <h3 className="text-lg font-bold text-[#0F766E]">
              Why is this required?
            </h3>

            <p className="mt-3 text-gray-600 leading-7">
              To maintain a trusted legal marketplace, every lawyer must
              complete a one-time publishing payment before making their
              professional profile publicly available.
            </p>
          </div>

          {/* Benefits */}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border p-4">
              <HiBadgeCheck className="text-[#AF8752]" />
              <span>Create your professional profile</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-4">
              <BiBadgeCheck className="text-[#AF8752]" />
              <span>Appear in Browse Lawyers</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-4">
              <BiSolidBadgeCheck className="text-[#AF8752]" />
              <span>Receive hiring requests</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-4">
              <LuBadgeCheck className="text-[#AF8752]" />
              <span>Lifetime verification</span>
            </div>
          </div>

          {/* Price */}

          <div className="rounded-2xl border-2 border-dashed border-[#AF8752] bg-[#FFF9F1] p-8 text-center">
            <p className="text-gray-500 uppercase tracking-widest">
              One-Time Publishing Fee
            </p>

            <h1 className="mt-2 text-5xl font-black text-[#166534]">$25</h1>

            <p className="mt-3 text-sm text-gray-600">
              Pay once and publish your lawyer profile permanently.
            </p>
          </div>

          {/* Button */}

         
          <form action="/api/checkout_sessions" method="POST">
            <input type="hidden" name="paymentType" value="publishing" />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#556B2F] px-6 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#98703E]"
            >
              Pay & Continue
            </button>
          </form>

          {/* <Link
            href="/dashboard/lawyer/publishing-payment"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#556B2F] px-6 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#98703E]"
          >
            <BiCreditCardAlt className="h-5 w-5" />
            Pay & Continue
            <BsArrowRight className="h-5 w-5" />
          </Link> */}
        </div>
      </div>
    </div>
  );
}
