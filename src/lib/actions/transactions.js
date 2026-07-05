"use server";

import { protectedFetch } from "../core/server";

export const getAllTransactions = async () => {
  const data = await protectedFetch(`/api/transactions`);
  return data || [];
};