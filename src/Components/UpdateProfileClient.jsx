"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUserProfile } from "@/lib/actions/update-profile";

export default function UpdateProfileClient({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name can't be empty.");
      return;
    }

    setLoading(true);

    const result = await updateUserProfile({
      email: user?.email,
      name,
      image,
    });

    setLoading(false);

    if (result?.success) {
      toast.success(result.message || "Profile updated!");
      setTimeout(() => router.push("/dashboard/user/update-profile"), 1000);
    } else {
      toast.error(result?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-14 font-sans">
      <div className="mx-auto max-w-[600px]">
        <h1 className="mb-8 font-[Georgia,_serif] text-[28px] font-extrabold text-[#11100C]">
          Update Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[24px] border border-[#f0f0f0] bg-white p-8"
        >
          {/* Profile Picture Preview */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={image || "https://i.ibb.co/4ZQZ6q0/default-avatar.png"}
              alt="Profile preview"
              className="h-28 w-28 rounded-full border-4 border-[#f8f7f4] object-cover shadow-lg"
              onError={(e) => {
                e.target.src = "https://i.ibb.co/4ZQZ6q0/default-avatar.png";
              }}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-2 block text-[12px] font-bold text-[#11100C]">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full rounded-xl border border-[#AF8752]/20 p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#AF8752]/20"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-[12px] font-bold text-[#11100C]">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-[#AF8752]/20 p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#AF8752]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#11100C] py-3.5 text-[12px] font-extrabold uppercase tracking-[1.5px] text-white transition hover:bg-[#FFD500] hover:text-black disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}