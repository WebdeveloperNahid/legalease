

"use server"

import { serverMutation } from "../core/server";




// Hire বাটনে Confirm করলে কল হবে
export const createHiringRequest = async (hiringData) => {
  return serverMutation("/api/hiring-requests", hiringData);
};
