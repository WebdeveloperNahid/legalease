import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getUserSession } from "@/lib/core/session";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const formData = await request.formData();
    const requestId = formData.get("hiringRequest_Id");
    // const priceId = PLAN_PRICE_ID[requestId];

    // new dynamic strip

    // ❌ বাদ দেওয়া হলো: const priceId = PLAN_PRICE_ID[requestId];
    // ✅ যুক্ত হলো: requestId দিয়ে আসল hiring request data backend থেকে আনা
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/hiring-requests/${requestId}`,
    );
    const hiringRequest = await res.json(); // এর ভেতরেই lawyer-এর actual fee আছে (data.fee)

    if (!hiringRequest) {
      return NextResponse.json(
        { error: "Hiring request not found" },
        { status: 404 },
      );
    }

    // fenish dynamic strip

    const user = await getUserSession();

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          // ❌ বাদ দেওয়া হলো: price: priceId,  (pre-created fixed Price ব্যবহার হতো)
          // ✅ যুক্ত হলো: price_data দিয়ে dynamic price বানানো — কোনো pre-created Price লাগবে না
          price_data: {
            currency: "usd",
            product_data: {
              name: `Hiring fee — ${hiringRequest.lawyerName || "Lawyer"}`,
            },
            unit_amount: Math.round(hiringRequest.fee * 100), // DB-এর আসল fee থেকে সরাসরি (dollars -> cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { hiringRequestId: requestId },
      success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
