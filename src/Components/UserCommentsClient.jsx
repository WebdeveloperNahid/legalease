"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaCalendarDays,
  FaCheck,
  FaCommentDots,
  FaPen,
  FaQuoteLeft,
  FaSpinner,
  FaTrashCan,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { deleteReview, updateReview } from "@/lib/actions/comments";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8 | Border #DCE3EE | Tint #F3F6FB
  সাদা background-এ gold লেখা #8A6A1C
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

const btnBase = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 motion-reduce:transition-none ${focusRing}`;
const btnSm = `${btnBase} h-9 px-4 text-xs`;
const btnMd = `${btnBase} h-12 rounded-xl px-6 text-sm`;

const btnGold = `bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_6px_18px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(226,185,59,0.5)] disabled:shadow-none disabled:hover:translate-y-0`;
const btnOutline =
  "border border-[#0B1526]/25 bg-white text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]";
const btnDanger =
  "border border-[#B91C1C]/40 bg-white text-[#B91C1C] hover:border-[#B91C1C] hover:bg-[#B91C1C] hover:text-white";
const btnDangerSolid = "bg-[#B91C1C] text-white hover:bg-[#991B1B]";

/* ---------- Helpers ---------- */
function formatDate(value) {
  if (!value) return "Date unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Date unknown";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ---------- Modal (Escape, focus আটকানো, scroll বন্ধ, বন্ধ হলে focus ফেরা) ---------- */
function Modal({ open, onClose, titleId, size = "max-w-md", children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const el = ref.current;
    const focusables = () =>
      el
        ? Array.from(
            el.querySelectorAll(
              "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
            )
          )
        : [];

    focusables()[0]?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1526]/70 backdrop-blur-sm"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[90vh] w-full ${size} overflow-y-auto rounded-2xl border border-[#E2B93B]/30 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.45)]`}
      >
        <div
          aria-hidden="true"
          className="h-1.5 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
        />
        {children}
      </div>
    </div>
  );
}

/* ---------- Main ---------- */
export default function UserCommentsClient({ comments = [] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // পেজ খোলার animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ---------- Edit ---------- */
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditText(item.comment || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdate = async (item) => {
    const text = editText.trim();
    if (!text) return;

    setBusyId(item._id);
    try {
      const result = await updateReview(item._id, text);
      if (result?.success) {
        toast.success(result.message || "Comment updated!");
        setEditingId(null);
        setEditText("");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update comment.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  /* ---------- Delete ---------- */
  const closeDelete = useCallback(() => {
    if (deleting) return;
    setDeleteTarget(null);
  }, [deleting]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const result = await deleteReview(deleteTarget._id);
      if (result?.success) {
        toast.success(result.message || "Comment deleted!");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to delete comment.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= Render ================= */
  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div
        className={`overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)] transition-all duration-500 ease-out motion-reduce:transition-none ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-6 py-8 sm:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-56 w-80 rounded-full bg-[#E2B93B]/10 blur-[90px]"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
                My activity
              </span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl"
              style={headingFont}
            >
              My comments
            </h1>
            <div
              aria-hidden="true"
              className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              Review, edit or remove the comments you have shared
            </p>

            {comments.length > 0 && (
              <dl className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                  <dt className="text-xs text-[#E8DCC8]/85">Total</dt>
                  <dd
                    className="text-sm font-bold text-[#F3D98B]"
                    style={headingFont}
                  >
                    {comments.length}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </header>

        {/* ---------- Body ---------- */}
        {comments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14213D] text-2xl text-[#E2B93B]">
              <FaCommentDots aria-hidden="true" />
            </div>
            <h2
              className="mt-6 text-2xl font-bold tracking-[-0.01em] text-[#14213D]"
              style={headingFont}
            >
              No comments yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#475569]">
              You haven&apos;t left any comments yet. When you do, they will
              appear here.
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-4 bg-[#F3F6FB]/60 p-4 sm:p-6">
              {comments.map((item, i) => {
                const isEditing = editingId === item._id;
                const isRowBusy = busyId === item._id;
                const trimmed = editText.trim();
                const canSave =
                  trimmed.length > 0 && trimmed !== (item.comment || "").trim();

                return (
                  <li
                    key={String(item._id)}
                    style={{ transitionDelay: mounted ? `${Math.min(i, 6) * 70}ms` : "0ms" }}
                    className={`relative overflow-hidden rounded-xl border bg-white p-5 transition-all duration-500 motion-reduce:transition-none sm:p-6 ${
                      mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    } ${
                      isEditing
                        ? "border-[#E2B93B] shadow-[0_10px_28px_rgba(11,21,38,0.1)]"
                        : "border-[#DCE3EE] hover:border-[#E2B93B]/60 hover:shadow-[0_8px_22px_rgba(11,21,38,0.08)]"
                    }`}
                  >
                    {/* gold বাম রেখা */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
                    />

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        {item.lawyerName && (
                          <p className="truncate text-sm font-semibold capitalize text-[#14213D]">
                            {item.lawyerName}
                          </p>
                        )}
                        <p className="flex items-center gap-1.5 text-xs text-[#475569]">
                          <FaCalendarDays aria-hidden="true" className="text-[#8A6A1C]" />
                          <time dateTime={item.createdAt ? String(item.createdAt) : undefined}>
                            {formatDate(item.createdAt)}
                          </time>
                        </p>
                      </div>

                      {!isEditing && (
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            disabled={isRowBusy || editingId !== null}
                            className={`${btnSm} ${btnOutline}`}
                          >
                            <FaPen aria-hidden="true" className="text-[10px]" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            disabled={isRowBusy || editingId !== null}
                            className={`${btnSm} ${btnDanger}`}
                          >
                            <FaTrashCan aria-hidden="true" className="text-[10px]" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-4">
                        <label
                          htmlFor={`edit-${item._id}`}
                          className="mb-1.5 block text-sm font-semibold text-[#0B1526]"
                        >
                          Edit your comment
                        </label>
                        <textarea
                          id={`edit-${item._id}`}
                          rows={4}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") cancelEdit();
                            if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSave) {
                              handleUpdate(item);
                            }
                          }}
                          disabled={isRowBusy}
                          autoFocus
                          className="w-full resize-y rounded-xl border border-[#DCE3EE] bg-white px-4 py-3 text-sm leading-relaxed text-[#0B1526] outline-none transition placeholder:text-slate-400 focus:border-[#E2B93B] focus:ring-4 focus:ring-[#E2B93B]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        <p className="mt-1.5 text-xs text-slate-500">
                          Press Esc to cancel, Ctrl + Enter to save.
                        </p>

                        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isRowBusy}
                            className={`${btnMd} ${btnOutline}`}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdate(item)}
                            disabled={isRowBusy || !canSave}
                            aria-busy={isRowBusy}
                            className={`${btnMd} ${btnGold}`}
                          >
                            {isRowBusy ? (
                              <>
                                <FaSpinner
                                  aria-hidden="true"
                                  className="animate-spin motion-reduce:animate-none"
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaCheck aria-hidden="true" className="text-xs" />
                                Save changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex gap-3">
                        <FaQuoteLeft
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-lg text-[#E2B93B]"
                        />
                        <p className="whitespace-pre-line break-words text-base leading-[1.8] text-slate-700">
                          {item.comment}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-3 text-xs text-[#475569]">
              {comments.length} {comments.length === 1 ? "comment" : "comments"} total
            </div>
          </>
        )}
      </div>

      {/* ---------- Delete confirmation ---------- */}
      <Modal open={!!deleteTarget} onClose={closeDelete} titleId="delete-comment-title">
        <div className="p-6 text-center sm:p-8">
          <span
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2] text-xl text-[#B91C1C]"
          >
            <FaTriangleExclamation />
          </span>
          <h2
            id="delete-comment-title"
            className="mt-5 text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
            style={headingFont}
          >
            Delete this comment?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            This comment will be removed permanently. This cannot be undone.
          </p>

          {deleteTarget?.comment && (
            <p className="mt-4 line-clamp-3 rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] px-4 py-3 text-left text-sm italic text-slate-600">
              {deleteTarget.comment}
            </p>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={closeDelete}
              disabled={deleting}
              className={`${btnMd} ${btnOutline}`}
            >
              Keep comment
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              aria-busy={deleting}
              className={`${btnMd} ${btnDangerSolid}`}
            >
              {deleting ? (
                <>
                  <FaSpinner
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                  />
                  Deleting...
                </>
              ) : (
                "Yes, delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}