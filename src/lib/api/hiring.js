
"use server"

import { protectedFetch } from "../core/server";




// User & Lawyer 2 jon er Hiring history আনার জন্য

export const getUserHiringHistory = async (userId) => {
  return protectedFetch(`/api/hiring-requests/user/${userId}`);
};

// Lawyer এর history আনা
export const getLawyerHiringHistory = async (lawyerId) => {
  return protectedFetch(`/api/hiring-requests/lawyer/${lawyerId}`);
};

