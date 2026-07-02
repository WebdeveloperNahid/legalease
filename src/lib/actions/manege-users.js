"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";


export const changeUserRole = async (email, role) => {
  const result = await serverMutation("/api/users/role", { email, role }, "PATCH");

  if (!result) {
    return { success: false, message: "Failed to update role." };
  }

  revalidatePath("/dashboard/admin/manage-users");
  return { success: true, message: "Role updated successfully!" };
};



export const deleteUser = async (email) => {
  const result = await serverMutation("/api/users", { email }, "DELETE");

  if (!result) {
    return { success: false, message: "Failed to delete user." };
  }

  revalidatePath("/dashboard/admin/manage-users");
  return { success: true, message: "User deleted successfully!" };
};


