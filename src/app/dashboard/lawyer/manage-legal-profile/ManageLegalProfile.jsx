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

const inputStyle = {
  backgroundColor: "#11100C",
  border: "1px solid #AF8752",
  color: "#FFD500",
  borderRadius: 10,
  padding: "9px 14px",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "#AF8752",
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 6,
  display: "block", 
};

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
        <label style={labelStyle}>Full Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Adv. Rahim Uddin"
          style={inputStyle}
        />
      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>Bio / Professional Summary</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Write a short professional summary..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Specialization */}
      <div>
        <label style={labelStyle}>Specialization</label>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="" disabled style={{ backgroundColor: "#11100C" }}>
            Select specialization...
          </option>
          {specializations.map((s) => (
            <option key={s} value={s} style={{ backgroundColor: "#11100C" }}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Fee */}
      <div>
        <label style={labelStyle}>Consultation Fee ($)</label>
        <input
          name="fee"
          type="number"
          min="0"
          value={formData.fee}
          onChange={handleChange}
          required
          placeholder="e.g. 500"
          style={inputStyle}
        />
      </div>

      {/* Image */}
      <div>
        <label style={labelStyle}>Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ ...inputStyle, padding: "8px 12px", cursor: "pointer" }}
        />
        {imagePreview && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 10,
            }}
          >
            <img
              src={imagePreview}
              alt="preview"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #FFD500",
              }}
            />
            <span style={{ color: "#AF8752", fontSize: 12 }}>
              {uploadingImage ? "⏳ Uploading to imgBB..." : "Preview"}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            backgroundColor: "#1a0000",
            border: "1px solid #ff6b6b",
            color: "#ff6b6b",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          style={{
            backgroundColor: "#001a00",
            border: "1px solid #FFD500",
            color: "#FFD500",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
          }}
        >
          ✅ {success}
        </div>
      )}
    </>
  );

  // ════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════
  return (
    <div style={{ color: "#AF8752", padding: "8px 0" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              color: "#FFD500",
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Manage Legal Profile
          </h1>
          <p
            style={{
              color: "#AF8752",
              fontSize: 13,
              marginTop: 6,
              marginBottom: 0,
            }}
          >
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
            style={{
              backgroundColor: "#FFD500",
              color: "#11100C",
              fontWeight: 700,
              borderRadius: 10,
              padding: "9px 20px",
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            + Create Profile
          </button>
        )}
      </div>

      {/* Global success */}
      {success && !showCreateForm && !showModal && (
        <div
          style={{
            backgroundColor: "#001a00",
            border: "1px solid #FFD500",
            color: "#FFD500",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          ✅ {success}
        </div>
      )}

      {/* ── CREATE FORM ──────────────────────────────── */}
      {!profile && showCreateForm && (
        <div
          style={{
            backgroundColor: "#2E2D10",
            border: "1px solid #AF8752",
            borderRadius: 14,
            padding: 24,
            maxWidth: 560,
          }}
        >
          <h2
            style={{
              color: "#FFD500",
              fontSize: 17,
              fontWeight: 600,
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            Create Your Legal Profile
          </h2>
          <form
            onSubmit={handleCreate}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {renderFormFields()}
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              style={{
                backgroundColor:
                  submitting || uploadingImage ? "#8a7200" : "#FFD500",
                color: "#11100C",
                fontWeight: 700,
                borderRadius: 10,
                padding: "12px 0",
                fontSize: 14,
                border: "none",
                cursor:
                  submitting || uploadingImage ? "not-allowed" : "pointer",
                width: "100%",
              }}
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
            style={{
              marginTop: 12,
              width: "100%",
              fontSize: 13,
              color: "#AF8752",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 0",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── PROFILE TABLE ────────────────────────────── */}
      {profile && (
        <div
          style={{
            backgroundColor: "#2E2D10",
            border: "1px solid #AF8752",
            borderRadius: 14,
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
              minWidth: 540,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #AF8752" }}>
                {[
                  "Photo",
                  "Name & Bio",
                  "Specialization",
                  "Fee",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      color: "#FFD500",
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 16 }}>
                  <img
                    src={profile.image}
                    alt={profile.name}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #FFD500",
                    }}
                  />
                </td>
                <td style={{ padding: 16 }}>
                  <p style={{ color: "#FFD500", fontWeight: 600, margin: 0 }}>
                    {profile.name}
                  </p>
                  <p
                    style={{
                      color: "#AF8752",
                      fontSize: 12,
                      marginTop: 4,
                      marginBottom: 0,
                      maxWidth: 220,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {profile.bio}
                  </p>
                </td>
                <td style={{ padding: 16 }}>
                  <span
                    style={{
                      backgroundColor: "#11100C",
                      border: "1px solid #AF8752",
                      color: "#FFD500",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {profile.specialization}
                  </span>
                </td>
                <td
                  style={{
                    padding: 16,
                    color: "#FFD500",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  ${profile.fee}
                </td>
                <td style={{ padding: 16 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={openEditModal}
                      style={{
                        backgroundColor: "#FFD500",
                        color: "#11100C",
                        fontWeight: 700,
                        borderRadius: 8,
                        padding: "7px 16px",
                        fontSize: 13,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      style={{
                        backgroundColor: "transparent",
                        color: "#ff6b6b",
                        fontWeight: 700,
                        borderRadius: 8,
                        padding: "7px 16px",
                        fontSize: 13,
                        border: "1px solid #ff6b6b",
                        cursor: "pointer",
                      }}
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
        >
          <div
            style={{
              backgroundColor: "#2E2D10",
              border: "1px solid #AF8752",
              borderRadius: 16,
              padding: 28,
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  color: "#FFD500",
                  fontSize: 17,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Edit Legal Profile
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                style={{
                  color: "#AF8752",
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleUpdate}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {renderFormFields()}
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                style={{
                  backgroundColor:
                    submitting || uploadingImage ? "#8a7200" : "#FFD500",
                  color: "#11100C",
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "12px 0",
                  fontSize: 14,
                  border: "none",
                  cursor:
                    submitting || uploadingImage ? "not-allowed" : "pointer",
                  width: "100%",
                }}
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
