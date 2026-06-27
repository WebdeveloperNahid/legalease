import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { createPayment } from "@/lib/actions/payments";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  }

  const {
    status,
    customer_details: { email: customerEmail },
    metadata,
    amount_total,
    currency,
    created,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const payInfo = {
      email: customerEmail,
      hiringRequestId: metadata.hiringRequestId,
      currency,
      sessionId: session_id,
      paidAt: new Date(created * 1000),
      fee: amount_total / 100,
    };

    console.log("Saving this:", payInfo);
    const transitionInfo = await createPayment(payInfo);
    console.log("I am Transition Data ===", transitionInfo);

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[32px] border border-[#f0f0f0] shadow-xl text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mb-6">
            <svg
              className="h-10 w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="font-[Georgia,_serif] text-3xl font-extrabold text-[#11100C] mb-4">
            Payment Successful!
          </h2>

          <p className="text-[#6b6b6b] text-base mb-8 leading-relaxed">
            We appreciate your business! A confirmation email has been sent to
            <span className="font-bold text-[#11100C] block mt-2 text-lg">
              {customerEmail}
            </span>
          </p>

          <div className="space-y-4">
            <Link
              href={`/payments/success/paidinfo?hiringRequestId=${metadata.hiringRequestId}`}
              className="block w-full py-4 bg-[#11100C] text-white rounded-2xl font-bold uppercase tracking-[1px] hover:bg-[#AF8752] transition-all duration-300 transform hover:scale-[1.02]"
            >
              View Hiring History 
            </Link>

            <p className="text-[13px] text-[#9b9b9b] pt-4">
              Need help? Email us at{" "}
              <a
                href="mailto:support@legalease.com"
                className="text-[#AF8752] underline font-medium hover:text-[#8e6e42]"
              >
                support@legalease.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
