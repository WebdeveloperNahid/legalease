import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getUserSession } from "@/lib/core/session";
import { stripe } from "@/lib/stripe";

const PUBLISHING_FEE = Number(process.env.PUBLISHING_FEE || 50);

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const formData = await request.formData();
    const paymentType = formData.get("paymentType"); // "publishing" or "hiring"

    const user = await getUserSession();

    // =============================================
    // 🆕 PUBLISHING PAYMENT — Lawyer pays Admin
    // =============================================
    if (paymentType === "publishing") {
      const session = await stripe.checkout.sessions.create({
        customer_email: user?.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Lawyer Profile Publishing Fee",
                description: "One-time fee to publish your lawyer listing",
              },
              unit_amount: PUBLISHING_FEE * 100, // $50 → 5000 cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          paymentType: "publishing",
          lawyerEmail: user?.email, // backend এ user identify করতে
        },
        success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard/lawyer`, // cancel করলে lawyer dashboard এ ফেরত
      });

      return NextResponse.redirect(session.url, 303);
    }

    // =============================================
    // ✅ EXISTING HIRING PAYMENT — User pays Lawyer
    // (এই block এ কিছু change করিনি)
    // =============================================..

    // const priceId = PLAN_PRICE_ID[requestId];
    // new dynamic strip

    // ❌ বাদ দেওয়া হলো: const priceId = PLAN_PRICE_ID[requestId];
    // ✅ যুক্ত হলো: requestId দিয়ে আসল hiring request data backend থেকে আনা

    const requestId = formData.get("hiringRequest_Id");
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
      metadata: {
        paymentType: "hiring",
        hiringRequestId: requestId,
      },
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
