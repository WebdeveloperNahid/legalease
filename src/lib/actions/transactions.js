"use server";

import { serverFetch } from "../core/server";

export const getAllTransactions = async () => {
  const transactions = await serverFetch("/api/transactions");
  return transactions || [];
};