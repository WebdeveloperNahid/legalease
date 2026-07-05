"use server";

import { protectedFetch} from "../core/server";

export const getAllUsers = async () => {
  const users = await protectedFetch("/api/users");
  return users || [];
};