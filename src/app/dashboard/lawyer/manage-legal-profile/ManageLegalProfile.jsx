"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createNewLawyer,
  deleteLawyer,
  updateLawyer,
} from "@/lib/actions/add-lawyer";
import {
  FaCircleCheck,
  FaCloudArrowUp,
  FaPen,
  FaPlus,
  FaScaleBalanced,
  FaSpinner,
  FaTrashCan,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";

/* ---------- Config ---------- */
const IMGBB_KEY = process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API;
const CURRENCY = "$"; // Browse card-এর সাথে একই রাখুন
const MAX_IMAGE_MB = 5;

const specializations = [
  "Criminal Law",
  "Family Law",
  "Corporate Law",
  "Tax Law",
  "Immigration Law",
  "Civil Law",
  "Intellectual Property",
  "Real Estate Law",
  "Labor Law",
  "Environmental Law",
];

const emptyForm = { name: "", bio: "", fee: "", specialization: "" };

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Border #DCE3EE | Tint #F3F6FB
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

const inputClass =
  "w-full rounded-xl border border-[#DCE3EE] bg-white px-4 py-3 text-sm text-[#0B1526] placeholder:text-slate-400 outline-none transition focus:border-[#E2B93B] focus:ring-4 focus:ring-[#E2B93B]/20 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#0B1526]";

const btnBase = `inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${focusRing}`;
const btnGold = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(226,185,59,0.5)] disabled:hover:translate-y-0`;
const btnOutline = `${btnBase} border border-[#0B1526]/25 bg-white text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]`;
const btnDanger = `${btnBase} border border-[#DC2626]/40 bg-white text-[#B91C1C] hover:border-[#B91C1C] hover:bg-[#B91C1C] hover:text-white`;
const btnDangerSolid = `${btnBase} bg-[#B91C1C] text-white hover:bg-[#991B1B]`;

/* ---------- Helpers ---------- */
function statusUi(status) {
  if (!status) return null;
  const s = String(status).toLowerCase().trim();
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  if (["available", "active", "approved", "verified"].includes(s))
    return { label, cls: "border-[#B7E4C7] bg-[#ECFDF3] text-[#166534]" };
  if (["busy", "pending"].includes(s))
    return { label, cls: "border-[#F3D9A4] bg-[#FFF7E6] text-[#92400E]" };
  return { label, cls: "border-[#DCE3EE] bg-[#F3F6FB] text-[#14213D]" };
}

/* ছবি, না থাকলে বা লোড না হলে নামের প্রথম অক্ষর */
function Photo({ src, name, alt, textClass = "text-4xl" }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center font-bold text-[#E2B93B] ${textClass}`}
      style={headingFont}
    >
      {(name || "L").charAt(0).toUpperCase()}
    </span>
  );
}

/* ---------- Modal (Escape, focus আটকানো, scroll বন্ধ, বন্ধ হলে focus ফেরা) ---------- */
function Modal({ open, onClose, titleId, size = "max-w-lg", children }) {
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

/* ---------- Form fields (Create ও Edit দুই জায়গায় ব্যবহার) ---------- */
function FormFields({
  idPrefix,
  formData,
  onChange,
  imagePreview,
  onImageChange,
  uploadingImage,
  disabled,
  error,
}) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${idPrefix}-name`} className={labelClass}>
          Full name
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          disabled={disabled}
          placeholder="e.g. Adv. Rahim Uddin"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-spec`} className={labelClass}>
            Specialization
          </label>
          <select
            id={`${idPrefix}-spec`}
            name="specialization"
            value={formData.specialization}
            onChange={onChange}
            required
            disabled={disabled}
            className={inputClass}
          >
            <option value="" disabled>
              Select specialization
            </option>
            {specializations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-fee`} className={labelClass}>
            Consultation fee (per hour)
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500"
            >
              {CURRENCY}
            </span>
            <input
              id={`${idPrefix}-fee`}
              name="fee"
              type="number"
              min="0"
              value={formData.fee}
              onChange={onChange}
              required
              disabled={disabled}
              placeholder="500"
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-bio`} className={labelClass}>
          Professional summary
        </label>
        <textarea
          id={`${idPrefix}-bio`}
          name="bio"
          value={formData.bio}
          onChange={onChange}
          required
          disabled={disabled}
          rows={4}
          placeholder="Write a short summary of your experience and the cases you handle..."
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <span className={labelClass}>Profile photo</span>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-[#0B1526]/25 bg-[#F3F6FB] p-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#DCE3EE] bg-[#14213D]">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Selected profile photo preview"
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-full w-full items-center justify-center text-2xl text-[#E2B93B]"
              >
                <FaCloudArrowUp />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <label
              className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#0B1526]/25 bg-white px-4 text-sm font-semibold text-[#0B1526] transition-colors hover:border-[#0B1526] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E2B93B] ${
                disabled ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <FaCloudArrowUp aria-hidden="true" />
              {imagePreview ? "Change photo" : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                disabled={disabled}
                className="sr-only"
              />
            </label>
            <p className="mt-2 text-xs text-slate-500" aria-live="polite">
              {uploadingImage
                ? "Uploading your photo..."
                : `JPG or PNG, up to ${MAX_IMAGE_MB}MB. A clear, professional headshot works best.`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#991B1B]"
        >
          <FaTriangleExclamation aria-hidden="true" className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

/* ---------- Main ---------- */
export default function ManageLegalProfile({ lawyer, getLawyers }) {
  const [profile, setProfile] = useState(
    Array.isArray(getLawyers) ? getLawyers[0] : getLawyers
  );
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const busy = submitting || uploadingImage;

  // ব্রাউজারের অস্থায়ী preview URL মুছে ফেলা (memory leak এড়াতে)
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  /* ---------- imgBB upload ---------- */
  const uploadToImgBB = async (file) => {
    if (!IMGBB_KEY) {
      throw new Error(
        "Image upload is not configured. Please contact the site admin."
      );
    }
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(`imgBB server error (${res.status})`);
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || "imgBB upload failed");
      }
      return json.data.url;
    } catch (err) {
      console.error("imgBB upload error:", err);
      throw new Error(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  /* ---------- Handlers ---------- */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image must be less than ${MAX_IMAGE_MB}MB.`);
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setError("");
  };

  const closeCreate = useCallback(() => {
    if (busy) return;
    setShowCreate(false);
    resetForm();
  }, [busy]);

  const closeEdit = useCallback(() => {
    if (busy) return;
    setShowEdit(false);
    resetForm();
  }, [busy]);

  const closeDelete = useCallback(() => {
    if (deleting) return;
    setShowDelete(false);
  }, [deleting]);

  /* ---------- CREATE ---------- */
  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please upload a profile photo.");
      return;
    }
    if (!lawyer?.email) {
      setError("Session not found. Please sign in again.");
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadToImgBB(imageFile);

      const newProfile = {
        ...formData,
        fee: Number(formData.fee),
        image: imageUrl,
        email: lawyer.email || "",
        lawyerId: lawyer.id || lawyer._id,
        status: "pending",
        availability: "available",
      };

      const payload = await createNewLawyer(newProfile);
      if (payload && payload.insertedId) {
        toast.success("Lawyer profile created successfully!");
        setProfile({ ...newProfile, _id: payload.insertedId });
        setShowCreate(false);
        resetForm();
      } else {
        throw new Error("Failed to save profile on database.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- EDIT ---------- */
  const openEdit = () => {
    setFormData({
      name: profile.name || "",
      bio: profile.bio || "",
      fee: profile.fee ?? "",
      specialization: profile.specialization || "",
    });
    setImagePreview(profile.image || "");
    setImageFile(null);
    setError("");
    setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let imageUrl = profile.image;
      if (imageFile) imageUrl = await uploadToImgBB(imageFile);

      const updatedData = {
        ...formData,
        fee: Number(formData.fee),
        image: imageUrl,
      };

      const result = await updateLawyer(profile._id, updatedData);
      if (!result) throw new Error("Failed to update profile.");

      setProfile((prev) => ({ ...prev, ...updatedData }));
      setShowEdit(false);
      resetForm();
      toast.success("Profile updated!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteLawyer(profile._id);
      if (!result) throw new Error("Failed to delete profile.");
      setProfile(null);
      setShowDelete(false);
      toast.success("Profile deleted");
    } catch (err) {
      toast.error("Failed to delete profile. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const status = statusUi(profile?.status);
  const hasFee =
    profile?.fee !== undefined && profile?.fee !== null && profile?.fee !== "";

  /* ================= Render ================= */
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* ---------- Page header ---------- */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A6A1C]">
              Lawyer dashboard
            </span>
          </div>
          <h1
            className="mt-3 text-3xl font-bold tracking-[-0.015em] text-[#0B1526] sm:text-4xl"
            style={headingFont}
          >
            Manage Legal Profile
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {profile
              ? "This is your public listing on LegalEase. Keep it accurate and up to date."
              : "Create your profile to appear in Browse Lawyers and receive hiring requests."}
          </p>
        </div>

        {!profile && (
          <button type="button" onClick={openCreate} className={btnGold}>
            <FaPlus aria-hidden="true" className="text-xs" />
            Create profile
          </button>
        )}
      </div>

      {/* ---------- Empty state ---------- */}
      {!profile && (
        <div className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_6px_22px_rgba(11,21,38,0.06)]">
          <div
            aria-hidden="true"
            className="h-1.5 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-2 md:items-center">
            <div>
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E2B93B]/60 bg-[#0B1526] text-xl text-[#E2B93B]"
              >
                <FaScaleBalanced />
              </span>
              <h2
                className="mt-5 text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
                style={headingFont}
              >
                You have no profile yet
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A complete profile helps clients find and trust you. It only takes a
                minute.
              </p>
              <button type="button" onClick={openCreate} className={`${btnGold} mt-6`}>
                <FaPlus aria-hidden="true" className="text-xs" />
                Create your profile
              </button>
            </div>

            <ul className="space-y-4 rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-6">
              {[
                "Appear in Browse Lawyers",
                "Receive hiring requests from clients",
                "Get paid securely through Stripe",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-[#0B1526]">
                  <FaCircleCheck
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[#E2B93B]"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ---------- Profile card ---------- */}
      {profile && (
        <article className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_36px_rgba(11,21,38,0.1)]">
          {/* Header band */}
          <div className="relative bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-6 py-7 sm:px-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
            />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[3px] sm:h-28 sm:w-28">
                <div className="h-full w-full overflow-hidden rounded-[13px] bg-[#0B1526]">
                  <Photo
                    src={profile.image}
                    name={profile.name}
                    alt={`${profile.name || "Lawyer"} profile photo`}
                    textClass="text-5xl"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex max-w-full items-center rounded-full border border-[#E2B93B]/50 bg-[#E2B93B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F3D98B]">
                    <span className="truncate">
                      {profile.specialization || "Legal Counsel"}
                    </span>
                  </span>
                  {status && (
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>
                <h2
                  className="mt-3 truncate text-2xl font-bold capitalize tracking-[-0.01em] text-[#FBF6EA] sm:text-3xl"
                  style={headingFont}
                >
                  {profile.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Professional summary
              </h3>
              <p className="mt-2 whitespace-pre-line text-base leading-[1.8] text-slate-700">
                {profile.bio || "No summary added yet."}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                Consultation fee
              </p>
              <p
                className="mt-1 text-3xl font-bold text-[#0B1526]"
                style={headingFont}
              >
                {hasFee ? `${CURRENCY}${profile.fee}` : "Not set"}
                {hasFee && (
                  <span className="ml-1 text-sm font-medium text-slate-500">/hr</span>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-[#DCE3EE] bg-[#F3F6FB]/60 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button type="button" onClick={() => setShowDelete(true)} className={btnDanger}>
              <FaTrashCan aria-hidden="true" className="text-xs" />
              Delete profile
            </button>
            <button type="button" onClick={openEdit} className={btnGold}>
              <FaPen aria-hidden="true" className="text-xs" />
              Edit profile
            </button>
          </div>
        </article>
      )}

      {/* ---------- Create modal ---------- */}
      <Modal open={showCreate} onClose={closeCreate} titleId="create-title" size="max-w-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="create-title"
                className="text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
                style={headingFont}
              >
                Create your legal profile
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Clients will see this on LegalEase.
              </p>
            </div>
            <button
              type="button"
              onClick={closeCreate}
              disabled={busy}
              aria-label="Close"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE3EE] text-[#0B1526] transition-colors hover:border-[#0B1526] disabled:opacity-50 ${focusRing}`}
            >
              <FaXmark aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="mt-6">
            <FormFields
              idPrefix="create"
              formData={formData}
              onChange={handleChange}
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              uploadingImage={uploadingImage}
              disabled={busy}
              error={error}
            />
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCreate}
                disabled={busy}
                className={btnOutline}
              >
                Cancel
              </button>
              <button type="submit" disabled={busy} aria-busy={busy} className={btnGold}>
                {busy ? (
                  <>
                    <FaSpinner
                      aria-hidden="true"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    {uploadingImage ? "Uploading photo..." : "Saving..."}
                  </>
                ) : (
                  "Create profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ---------- Edit modal ---------- */}
      <Modal open={showEdit} onClose={closeEdit} titleId="edit-title" size="max-w-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="edit-title"
                className="text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
                style={headingFont}
              >
                Edit legal profile
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Update the details clients see.
              </p>
            </div>
            <button
              type="button"
              onClick={closeEdit}
              disabled={busy}
              aria-label="Close"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE3EE] text-[#0B1526] transition-colors hover:border-[#0B1526] disabled:opacity-50 ${focusRing}`}
            >
              <FaXmark aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="mt-6">
            <FormFields
              idPrefix="edit"
              formData={formData}
              onChange={handleChange}
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              uploadingImage={uploadingImage}
              disabled={busy}
              error={error}
            />
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEdit}
                disabled={busy}
                className={btnOutline}
              >
                Cancel
              </button>
              <button type="submit" disabled={busy} aria-busy={busy} className={btnGold}>
                {busy ? (
                  <>
                    <FaSpinner
                      aria-hidden="true"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    {uploadingImage ? "Uploading photo..." : "Saving..."}
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ---------- Delete confirmation ---------- */}
      <Modal open={showDelete} onClose={closeDelete} titleId="delete-title" size="max-w-md">
        <div className="p-6 text-center sm:p-8">
          <span
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2] text-xl text-[#B91C1C]"
          >
            <FaTriangleExclamation />
          </span>
          <h2
            id="delete-title"
            className="mt-5 text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
            style={headingFont}
          >
            Delete your profile?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Your listing will be removed from LegalEase and clients will no longer be
            able to find you. This cannot be undone.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={closeDelete}
              disabled={deleting}
              className={btnOutline}
            >
              Keep profile
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-busy={deleting}
              className={btnDangerSolid}
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