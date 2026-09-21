"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaCircleCheck,
  FaCloudArrowUp,
  FaEnvelope,
  FaLink,
  FaLock,
  FaRotateLeft,
  FaSpinner,
  FaTrashCan,
  FaTriangleExclamation,
  FaUser,
} from "react-icons/fa6";
import { updateUserProfile } from "@/lib/actions/update-profile";

/* ---------- Config ---------- */
const IMGBB_KEY = process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API; // Lawyer profile পেজের মতোই
const MAX_IMAGE_MB = 5;

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

const inputClass =
  "w-full rounded-xl border border-[#DCE3EE] bg-white py-3 pl-11 pr-4 text-sm text-[#0B1526] placeholder:text-slate-400 outline-none transition focus:border-[#E2B93B] focus:ring-4 focus:ring-[#E2B93B]/20 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#0B1526]";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400";

const btnBase = `inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${focusRing}`;
const btnGold = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(226,185,59,0.5)] disabled:shadow-none disabled:hover:translate-y-0`;
const btnOutline = `${btnBase} border border-[#0B1526]/25 bg-white text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]`;

/* ছবি, না থাকলে বা লোড না হলে নামের প্রথম অক্ষর */
function Avatar({ src, name, failed, onError }) {
  if (src && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt="Profile preview"
        referrerPolicy="no-referrer"
        onError={onError}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#E2B93B]"
      style={headingFont}
    >
      {(name || "U").trim().charAt(0).toUpperCase() || "U"}
    </span>
  );
}

/* ---------- imgBB upload ---------- */
async function uploadToImgBB(file) {
  if (!IMGBB_KEY) {
    throw new Error("Image upload is not configured. Please contact the site admin.");
  }
  const data = new FormData();
  data.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error(`Upload failed (server error ${res.status})`);

  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Upload failed");
  return json.data.url;
}

export default function UpdateProfileClient({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // upload সংক্রান্ত state
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(""); // upload চলাকালীন সাথে সাথে দেখানোর ছবি
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  // user prop আপডেট হলে (router.refresh() এর পর) ফর্মের state sync করা
  useEffect(() => {
    setName(user?.name || "");
    setImage(user?.image || "");
  }, [user]);

  // পেজ খোলার animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ব্রাউজারের অস্থায়ী preview URL মুছে ফেলা (memory leak এড়াতে)
  useEffect(() => {
    return () => {
      if (localPreview.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const previewSrc = localPreview || image.trim();

  // ছবি বদলালে আবার নতুন করে লোড করে দেখা
  useEffect(() => {
    setImgFailed(false);
  }, [previewSrc]);

  const savedName = user?.name || "";
  const savedImage = user?.image || "";
  const dirty =
    name.trim() !== savedName.trim() || image.trim() !== savedImage.trim();
  const busy = loading || uploading;

  const handleReset = () => {
    setName(savedName);
    setImage(savedImage);
  };

  /* ---------- ফাইল বেছে নেওয়া / drop করা ---------- */
  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image must be less than ${MAX_IMAGE_MB}MB.`);
      return;
    }

    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImage(url);
      toast.success("Photo uploaded. Click Save changes to apply it.");
    } catch (err) {
      toast.error(err.message || "Image upload failed. Please try again.");
    } finally {
      setLocalPreview("");
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = ""; // একই ফাইল আবার বেছে নেওয়া যাবে
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  /* ---------- Save ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;

    if (!name.trim()) {
      toast.error("Name can't be empty.");
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserProfile({
        email: user?.email,
        name: name.trim(),
        image: image.trim(),
      });

      if (result?.success) {
        toast.success(result.message || "Profile updated!");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role ? String(user.role) : "";

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <div
        className={`overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)] transition-all duration-500 ease-out motion-reduce:transition-none ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-6 py-9 sm:px-10">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-56 w-80 rounded-full bg-[#E2B93B]/10 blur-[90px]"
          />

          <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left">
            <div className="h-28 w-28 shrink-0 rounded-full bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] p-[3px] shadow-[0_0_0_8px_rgba(226,185,59,0.1)] transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0B1526]">
                <Avatar
                  src={previewSrc}
                  name={name}
                  failed={imgFailed}
                  onError={() => setImgFailed(true)}
                />
                {uploading && (
                  <div
                    role="status"
                    aria-label="Uploading photo"
                    className="absolute inset-0 flex items-center justify-center bg-[#0B1526]/65"
                  >
                    <FaSpinner
                      aria-hidden="true"
                      className="animate-spin text-2xl text-[#E2B93B] motion-reduce:animate-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
                  Account settings
                </span>
              </div>

              <h1
                className="mt-3 truncate text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl"
                style={headingFont}
              >
                {name.trim() || "Your name"}
              </h1>

              <div
                aria-hidden="true"
                className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent sm:mx-0"
              />

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {role && (
                  <span className="inline-flex items-center rounded-full border border-[#E2B93B]/50 bg-[#E2B93B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F3D98B]">
                    {role}
                  </span>
                )}
                {user?.email && (
                  <span className="max-w-full truncate text-sm text-[#E8DCC8]/85">
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ---------- Form ---------- */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Edit your details
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-[#DCE3EE]" />
          </div>

          <div className="mt-5 space-y-5">
            {/* Full name */}
            <div>
              <label htmlFor="profile-name" className={labelClass}>
                Full name
              </label>
              <div className="relative">
                <FaUser aria-hidden="true" className={iconClass} />
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email (read only) */}
            <div>
              <label htmlFor="profile-email" className={labelClass}>
                Email address
              </label>
              <div className="relative">
                <FaEnvelope aria-hidden="true" className={iconClass} />
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className={`${inputClass} bg-[#F3F6FB] pr-11`}
                />
                <FaLock
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Your email is your sign-in ID and can&apos;t be changed here.
              </p>
            </div>

            {/* Profile photo: upload + URL */}
            <div>
              <span className={labelClass}>Profile photo</span>

              {/* Upload box (click অথবা drag & drop) */}
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!busy) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E2B93B] motion-reduce:transition-none ${
                  dragging
                    ? "border-[#E2B93B] bg-[#E2B93B]/10"
                    : "border-[#0B1526]/25 bg-[#F3F6FB] hover:border-[#E2B93B]"
                } ${busy ? "pointer-events-none opacity-60" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14213D] text-lg text-[#E2B93B]"
                >
                  {uploading ? (
                    <FaSpinner className="animate-spin motion-reduce:animate-none" />
                  ) : (
                    <FaCloudArrowUp />
                  )}
                </span>
                <span className="text-sm font-semibold text-[#0B1526]">
                  {uploading
                    ? "Uploading your photo..."
                    : image.trim()
                    ? "Change photo"
                    : "Upload a photo"}
                </span>
                <span className="text-xs text-slate-500" aria-live="polite">
                  {uploading
                    ? "Please wait, this takes a few seconds."
                    : `Click to choose or drag & drop. JPG or PNG, up to ${MAX_IMAGE_MB}MB.`}
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  disabled={busy}
                  className="sr-only"
                />
              </label>

              {image.trim() && (
                <button
                  type="button"
                  onClick={() => setImage("")}
                  disabled={busy}
                  className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B] disabled:opacity-50 ${focusRing}`}
                >
                  <FaTrashCan aria-hidden="true" />
                  Remove photo
                </button>
              )}

              {/* বিকল্প: URL */}
              <div className="my-5 flex items-center gap-3">
                <span aria-hidden="true" className="h-px flex-1 bg-[#DCE3EE]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  or paste a link
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-[#DCE3EE]" />
              </div>

              <label htmlFor="profile-image" className="sr-only">
                Profile picture URL
              </label>
              <div className="relative">
                <FaLink aria-hidden="true" className={iconClass} />
                <input
                  id="profile-image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  autoComplete="off"
                  disabled={busy}
                  className={inputClass}
                />
              </div>
              <p className="mt-1.5 min-h-[1.25rem] text-xs" aria-live="polite">
                {previewSrc && imgFailed ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#B45309]">
                    <FaTriangleExclamation aria-hidden="true" />
                    We couldn&apos;t load this image. Check the link.
                  </span>
                ) : (
                  <span className="text-slate-500">
                    An uploaded photo fills this link automatically.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* ---------- Actions ---------- */}
          <div className="mt-8 flex flex-col gap-4 border-t border-[#DCE3EE] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm font-medium" aria-live="polite">
              {uploading ? (
                <>
                  <FaSpinner
                    aria-hidden="true"
                    className="animate-spin text-[#8A6A1C] motion-reduce:animate-none"
                  />
                  <span className="text-[#8A6A1C]">Uploading photo...</span>
                </>
              ) : dirty ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[#B45309]"
                  />
                  <span className="text-[#B45309]">You have unsaved changes</span>
                </>
              ) : (
                <>
                  <FaCircleCheck aria-hidden="true" className="text-[#15803D]" />
                  <span className="text-slate-500">All changes saved</span>
                </>
              )}
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                disabled={!dirty || busy}
                className={btnOutline}
              >
                <FaRotateLeft aria-hidden="true" className="text-xs" />
                Reset
              </button>
              <button
                type="submit"
                disabled={!dirty || busy}
                aria-busy={loading}
                className={btnGold}
              >
                {loading ? (
                  <>
                    <FaSpinner
                      aria-hidden="true"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}