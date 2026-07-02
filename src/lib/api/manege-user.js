"use server";

import { serverFetch } from "../core/server";

export const getAllUsers = async () => {
  const users = await serverFetch("/api/users");
  return users || [];
};