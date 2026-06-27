
"use server"

import { serverFetch } from "../core/server";



// User & Lawyer er Hiring history আনার জন্য

export const getUserHiringHistory = async (userId) => {
  return serverFetch(`/api/hiring-requests/user/${userId}`);
};

