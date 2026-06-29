"use client";

import { createNewLawyer, deleteLawyer, updateLawyer } from "@/lib/actions/add-lawyer";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const IMGBB_KEY = process.env.NEXT_PUBLIC_UPLOAD_IMAGE_API;
// TODO: backend connect এর সময় uncomment করো
// import axios from "axios";
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// ── পুরোনো inputStyle / labelStyle অবজেক্টের বদলে Tailwind className স্ট্রিং ──
const inputClass =
  "w-full box-border bg-[#11100C] border border-[#AF8752] text-[#FFD500] rounded-[10px] px-3.5 py-[9px] text-sm outline-none";

const labelClass = "block text-[#AF8752] text-[13px] font-medium mb-1.5";

export default function ManageLegalProfile({ lawyer, getLawyers }) {
  const [profile, setProfile] = useState(
    Array.isArray(getLawyers) ? getLawyers[0] : getLawyers,
  );
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── imgBB Upload ─────────────────────────────────────
  const uploadToImgBB = async (file) => {
    setUploadingImage(true);
    try {
      const apikey = IMGBB_KEY || "4a81150588b086471a3c43a3e7ca5be1";
      const data = new FormData();
      data.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${apikey}`,
        { method: "POST", body: data },
      );
      if (!res.ok) {
        const errorHtmlOrText = await res.text();
        console.error("imgBB Server Raw Error:", errorHtmlOrText);
        throw new Error(`imgBB server error status: ${res.status}`);
      }

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || "imgBB upload failed");
      }

      return json.data.url; // সাকসেসফুল ইমেজ ইউআরএল ফেরত যাবে
    } catch (err) {
      console.error("💥 actual imgBB catch error:", err);
      throw new Error(`Image Upload Failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // ── useCallback দিয়ে — প্রতি render এ নতুন function তৈরি হবে না ──
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  // ── CREATE ───────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!imageFile) {
      setError("Please upload a profile photo.");
      return;
    }
    if (!lawyer?.email) {
      setError("Session not found. Please login again");
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

        setProfile({
          ...newProfile,
          _id: payload.insertedId || payload._id || "temp-id",
        });

        setSuccess("Profile created successfully!");
        setShowCreateForm(false);
        setFormData(emptyForm);
        setImageFile(null);
        setImagePreview("");
      } else {
        throw new Error("Failed to save profile on database.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  // ── EDIT open ────────────────────────────────────────
  const openEditModal = () => {
    setFormData({
      name: profile.name || "",
      bio: profile.bio || "",
      fee: profile.fee || "",
      specialization: profile.specialization || "",
    });
    setImagePreview(profile.image || "");
    setImageFile(null);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ── UPDATE ───────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      let imageUrl = profile.image;
      if (imageFile) imageUrl = await uploadToImgBB(imageFile);

      const updatedData = { ...formData, image: imageUrl };

      // backend এ PATCH request পাঠাচ্ছে
      const result = await updateLawyer(profile._id, updatedData);

      if (!result) {
        throw new Error("Failed to update profile.");
      }

      // local state ও update করো
      setProfile((prev) => ({ ...prev, ...updatedData }));
      setSuccess("Profile updated successfully!");
      setShowModal(false);
      toast.success("Profile updated!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  // ── DELETE ───────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;
    try {
      // ✅ backend এ DELETE request পাঠাচ্ছে
      const result = await deleteLawyer(profile._id);

      if (!result) {
        throw new Error("Failed to delete profile.");
      }

      setProfile(null);
      setSuccess("Profile deleted.");
      toast.success("Profile deleted!");
    } catch (err) {
      setError("Failed to delete profile.");
    }
  };
  // ── Shared form fields JSX — inline render ───────────
  // useCallback ব্যবহার করেছি তাই handleChange প্রতিবার নতুন হয় না
  // ফলে input focus থাকবে
  const renderFormFields = () => (
    <>
      {/* Name */}
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Adv. Rahim Uddin"
          className={inputClass}
        />
      </div>

      {/* Bio */}
      <div>
        <label className={labelClass}>Bio / Professional Summary</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Write a short professional summary..."
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Specialization */}
      <div>
        <label className={labelClass}>Specialization</label>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="" disabled className="bg-[#11100C]">
            Select specialization...
          </option>
          {specializations.map((s) => (
            <option key={s} value={s} className="bg-[#11100C]">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Fee */}
      <div>
        <label className={labelClass}>Consultation Fee ($)</label>
        <input
          name="fee"
          type="number"
          min="0"
          value={formData.fee}
          onChange={handleChange}
          required
          placeholder="e.g. 500"
          className={inputClass}
        />
      </div>

      {/* Image */}
      <div>
        <label className={labelClass}>Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`${inputClass} px-3 py-2 cursor-pointer`}
        />
        {imagePreview && (
          <div className="flex items-center gap-3 mt-2.5">
            <img
              src={imagePreview}
              alt="preview"
              className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[#FFD500]"
            />
            <span className="text-[#AF8752] text-xs">
              {uploadingImage ? "⏳ Uploading to imgBB..." : "Preview"}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#1a0000] border border-[#ff6b6b] text-[#ff6b6b] rounded-[10px] px-3.5 py-2.5 text-[13px]">
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-[#001a00] border border-[#FFD500] text-[#FFD500] rounded-[10px] px-3.5 py-2.5 text-[13px]">
          ✅ {success}
        </div>
      )}
    </>
  );

  // ════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════
  return (
    <div className="text-[#AF8752] py-2 px-0">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[#FFD500] text-[22px] font-bold m-0">
            Manage Legal Profile
          </h1>
          <p className="text-[#AF8752] text-[13px] mt-1.5 mb-0">
            {profile
              ? "Your legal service listing on LegalEase"
              : "No profile yet. Create one to appear in Browse Lawyers."}
          </p>
        </div>
        {!profile && !showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              setError("");
              setSuccess("");
            }}
            className="bg-[#FFD500] text-[#11100C] font-bold rounded-[10px] px-5 py-[9px] text-sm border-none cursor-pointer"
          >
            + Create Profile
          </button>
        )}
      </div>

      {/* Global success */}
      {success && !showCreateForm && !showModal && (
        <div className="bg-[#001a00] border border-[#FFD500] text-[#FFD500] rounded-[10px] px-3.5 py-2.5 text-[13px] mb-4">
          ✅ {success}
        </div>
      )}

      {/* ── CREATE FORM ──────────────────────────────── */}
      {!profile && showCreateForm && (
        <div className="bg-[#2E2D10] border border-[#AF8752] rounded-2xl p-6 max-w-[560px]">
          <h2 className="text-[#FFD500] text-[17px] font-semibold mb-5 mt-0">
            Create Your Legal Profile
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {renderFormFields()}
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className={`${
                submitting || uploadingImage ? "bg-[#8a7200]" : "bg-[#FFD500]"
              } text-[#11100C] font-bold rounded-[10px] py-3 text-sm border-none w-full ${
                submitting || uploadingImage ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {uploadingImage
                ? "⏳ Uploading image..."
                : submitting
                  ? "⏳ Saving..."
                  : "Create Profile"}
            </button>
          </form>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setError("");
              setFormData(emptyForm);
              setImageFile(null);
              setImagePreview("");
            }}
            className="mt-3 w-full text-[13px] text-[#AF8752] bg-transparent border-none cursor-pointer py-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── PROFILE TABLE ────────────────────────────── */}
      {profile && (
        <div className="bg-[#2E2D10] border border-[#AF8752] rounded-2xl overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[540px]">
            <thead>
              <tr className="border-b border-[#AF8752]">
                {[
                  "Photo",
                  "Name & Bio",
                  "Specialization",
                  "Fee",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-[#FFD500] px-4 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-[52px] h-[52px] rounded-full object-cover border-2 border-[#FFD500]"
                  />
                </td>
                <td className="p-4">
                  <p className="text-[#FFD500] font-semibold m-0">
                    {profile.name}
                  </p>
                  <p className="text-[#AF8752] text-xs mt-1 mb-0 max-w-[220px] overflow-hidden line-clamp-2">
                    {profile.bio}
                  </p>
                </td>
                <td className="p-4">
                  <span className="bg-[#11100C] border border-[#AF8752] text-[#FFD500] rounded-md px-2.5 py-1 text-xs font-semibold">
                    {profile.specialization}
                  </span>
                </td>
                <td className="p-4 text-[#FFD500] font-bold whitespace-nowrap">
                  ${profile.fee}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={openEditModal}
                      className="bg-[#FFD500] text-[#11100C] font-bold rounded-lg px-4 py-[7px] text-[13px] border-none cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-transparent text-[#ff6b6b] font-bold rounded-lg px-4 py-[7px] text-[13px] border border-[#ff6b6b] cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── EDIT MODAL ───────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80">
          <div className="bg-[#2E2D10] border border-[#AF8752] rounded-2xl p-7 w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#FFD500] text-[17px] font-bold m-0">
                Edit Legal Profile
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="text-[#AF8752] bg-transparent border-none text-[22px] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              {renderFormFields()}
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className={`${
                  submitting || uploadingImage ? "bg-[#8a7200]" : "bg-[#FFD500]"
                } text-[#11100C] font-bold rounded-[10px] py-3 text-sm border-none w-full ${
                  submitting || uploadingImage ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {uploadingImage
                  ? "⏳ Uploading image..."
                  : submitting
                    ? "⏳ Saving..."
                    : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
