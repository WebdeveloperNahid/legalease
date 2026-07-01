"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";
// import { redirect } from "next/navigation";

export const submitReview = async (formData) => {
  const lawyerId = formData.get("lawyerId");
  const hiringRequestId = formData.get("hiringRequestId");
  const userId = formData.get("userId");
  const userName = formData.get("userName");
  const comment = formData.get("comment");

 const result =  await serverMutation("/api/comments", {
    lawyerId,
    hiringRequestId,
    userId,
    userName,
    comment,
  });

  // redirect(`/payments/success/paidinfo?hiringRequestId=${hiringRequestId}`);

  if (!result) {
    return { success: false, message: "Failed to submit review. Try again." };
  }

  return { success: true, message: "Review submitted successfully!" };
};


export const updateReview = async (commentId, comment, lawyerPageId) => {
  if (!commentId || !comment?.trim()) {
    return { success: false, message: "Comment can't be empty." };
  }

  const result = await serverMutation(
    `/api/comments/${commentId}`,
    { comment },
    "PATCH"
  );

  if (!result) {
    return { success: false, message: "Failed to update review." };
  }

  if (lawyerPageId) revalidatePath(`/lawyers/${lawyerPageId}`);
  return { success: true, message: "Review updated!" };
};


export const deleteReview = async (commentId, lawyerPageId) => {
  if (!commentId) {
    return { success: false, message: "Invalid comment." };
  }

  const result = await serverMutation(
    `/api/comments/${commentId}`,
    undefined,
    "DELETE"
  );

  if (!result) {
    return { success: false, message: "Failed to delete review." };
  }

  if (lawyerPageId) revalidatePath(`/lawyers/${lawyerPageId}`);
  return { success: true, message: "Review deleted!" };
};