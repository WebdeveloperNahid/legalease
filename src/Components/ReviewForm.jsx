"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { submitReview } from "@/lib/actions/comments";

export default function ReviewForm({ data, session }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("lawyerId", data.lawyerId);
    formData.append("hiringRequestId", data._id);
    formData.append("userId", session.id);
    formData.append("userName", session.name || session.email);
    formData.append("comment", comment);

    const result = await submitReview(formData);

    setLoading(false);

    if (result?.success) {
      toast.success(result.message || "Review submitted!");
      setComment("");
      setTimeout(() => {
        router.push("/dashboard/user/hiring-history");
      }, 1000);
    } else {
      toast.error(result?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        rows="3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-4 rounded-xl border border-[#556B2F]/20 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 transition"
        placeholder="Share your experience with this lawyer..."
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#556B2F] text-white py-3 rounded-xl font-semibold hover:bg-[#3e4d22] transition-all shadow-md disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
