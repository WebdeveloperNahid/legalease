"use server";

import { serverMutation } from "../core/server";

// Payment related Post data
export const createPayment = async (paymentInfo) => {
  return serverMutation("/api/payments", paymentInfo);
};
