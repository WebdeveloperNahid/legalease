import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { createPayment } from "@/lib/actions/payments";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;
  console.log(session_id, 'lkfsdflaskdfjasldfjaklsdfasdf')

  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  };
  const {
    status,
    customer_details: { email: customerEmail },
    metadata,
  }
   

 = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });
  

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const payInfo = {
      email: customerEmail,
       hiringRequestId: metadata.hiringRequestId,  
    };
    const result = await createPayment(payInfo);
    console.log( "I am from Success to Transtion of Payment data ",result)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-[28px] border border-[#f0f0f0] shadow-[0_8px_40px_rgba(0,0,0,0.08)] text-center">
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

          <p className="text-[#6b6b6b] text-sm mb-8 leading-relaxed">
            We appreciate your business! A confirmation email has been sent to
            <span className="font-bold text-[#11100C] block mt-1">
              {customerEmail}
            </span>
          </p>

          <div className="space-y-3">
            <Link
              href="/dashboard/user/hiring-history"
              className="block w-full py-4 bg-[#11100C] text-white rounded-2xl font-bold uppercase tracking-[1px] hover:bg-[#AF8752] transition-all"
            >
              View Hiring History
            </Link>

            <p className="text-[12px] text-[#9b9b9b] pt-4">
              Need help? Email us at{" "}
              <a
                href="mailto:support@legalease.com"
                className="text-[#AF8752] underline"
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
