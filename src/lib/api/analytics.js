"use server";

import { protectedFetch } from "../core/server";

export const getAnalyticsOverview = async () => {
  const data = await protectedFetch("/api/analytics/overview");
  return (
    data || { totalUsers: 0, totalLawyers: 0, totalHires: 0, totalRevenue: 0 }
  );
};