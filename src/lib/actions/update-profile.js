"use server";

import { serverMutation } from "../core/server";
import { revalidatePath } from "next/cache";

export const updateUserProfile = async ({ email, name, image }) => {
  if (!email) {
    return { success: false, message: "Missing user email." };
  }

  const result = await serverMutation(
    "/api/users/profile",
    { email, name, image },
    "PATCH"
  );

  if (!result) {
    return { success: false, message: "Failed to update profile." };
  }

  revalidatePath("/dashboard/user/update-profile");

  return { success: true, message: "Profile updated successfully!" };
};