

"use server"

import { revalidatePath } from "next/cache";
import { serverFetch, serverMutation} from "../core/server";




//1️⃣ Hire বাটনে Confirm করলে কল হবে
export const createHiringRequest = async (hiringData) => {
  return serverMutation("/api/hiring-requests", hiringData);
};

// ────────────────────────────────────────────
// 2️⃣ User এর নিজের Hiring History
// Route: /dashboard/user/hiring-history
// ────────────────────────────────────────────
export const getUserHiringHistory = async (userId) => {
  if (!userId) return [];
  const data = await serverFetch(`/api/hiring-requests/user/${userId}`);
  return data || [];
};

// ────────────────────────────────────────────
// 3️⃣ Lawyer এর Hiring History
// Route: /dashboard/lawyer/hiring-history
// ────────────────────────────────────────────
export const getLawyerHiringHistory = async (lawyerId) => {
  if (!lawyerId) return [];
  const data = await serverFetch(`/api/hiring-requests/lawyer/${lawyerId}`);
  return data || [];
};

// ────────────────────────────────────────────
// 4️⃣ একটা নির্দিষ্ট Hiring Request আনা (id দিয়ে)
// Pay page এর জন্য লাগবে
// ────────────────────────────────────────────
export const getHiringRequestById = async (id) => {
  if (!id) return null;
  return serverFetch(`/api/hiring-requests/${id}`);  
};
// ────────────────────────────────────────────
// 5️⃣ Lawyer → Accept / Reject করবে   ← MAIN
// Route: /dashboard/lawyer/hiring-history
// ────────────────────────────────────────────
export const updateHiringStatus = async (requestId, status) => {
  if (!requestId || !status) return null;
  const result = await serverMutation(
    `/api/hiring-requests/${requestId}/status`,
    { status } ,"PATCH"
  );
  revalidatePath("/dashboard/lawyer/hiring-history");
  return result;
};