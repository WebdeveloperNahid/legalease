"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteReview, updateReview } from "@/lib/actions/comments";


export default function UserCommentsClient({ comments = [] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [busyId, setBusyId] = useState(null);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditText(item.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdate = async (item) => {
    if (!editText.trim()) return;
    setBusyId(item._id);
    const result = await updateReview(item._id, editText);
    setBusyId(null);

    if (result?.success) {
      toast.success(result.message || "Comment updated!");
      setEditingId(null);
      router.refresh();
    } else {
      toast.error(result?.message || "Failed to update comment.");
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    setBusyId(item._id);
    const result = await deleteReview(item._id);
    setBusyId(null);

    if (result?.success) {
      toast.success(result.message || "Comment deleted!");
      router.refresh();
    } else {
      toast.error(result?.message || "Failed to delete comment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      <div className="mx-auto max-w-[800px]">
        <h1 className="mb-8 font-[Georgia,_serif] text-[28px] font-extrabold text-[#11100C]">
          My Comments
        </h1>

        {comments.length === 0 ? (
          <div className="rounded-2xl border border-[#f0f0f0] bg-white p-10 text-center">
            <p className="text-[13px] text-[#9b9b9b]">
              You haven&apos;t left any comments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {comments.map((item) => {
              const isEditing = editingId === item._id;
              const isRowBusy = busyId === item._id;

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-[#f0f0f0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <p className="text-[11px] text-[#9b9b9b]">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    {!isEditing && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          disabled={isRowBusy}
                          className="rounded-lg border border-[#AF8752]/30 px-3 py-1 text-[11px] font-bold text-[#AF8752] hover:bg-[#AF8752]/10 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={isRowBusy}
                          className="rounded-lg border border-red-200 px-3 py-1 text-[11px] font-bold text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          {isRowBusy ? "..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        rows="3"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full rounded-xl border border-[#AF8752]/20 p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#AF8752]/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(item)}
                          disabled={isRowBusy}
                          className="rounded-lg bg-[#11100C] px-4 py-2 text-[11px] font-bold text-white disabled:opacity-50"
                        >
                          {isRowBusy ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={isRowBusy}
                          className="rounded-lg border px-4 py-2 text-[11px] font-bold disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] leading-[1.7] text-[#6b6b6b]">
                      {item.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}