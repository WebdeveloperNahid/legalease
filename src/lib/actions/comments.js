"use server";

import { serverMutation } from "../core/server";
import { redirect } from "next/navigation";

export const submitReview = async (formData) => {
  const lawyerId = formData.get("lawyerId");
  const hiringRequestId = formData.get("hiringRequestId");
  const userId = formData.get("userId");
  const userName = formData.get("userName");
  const comment = formData.get("comment");

  await serverMutation("/api/comments", {
    lawyerId,
    hiringRequestId,
    userId,
    userName,
    comment,
  });

  redirect(`/payments/success/paidinfo?hiringRequestId=${hiringRequestId}`);
};