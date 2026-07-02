"use server";

import { serverFetch } from "../core/server";

export const getAnalyticsOverview = async () => {
  const data = await serverFetch("/api/analytics/overview");
  return (
    data || { totalUsers: 0, totalLawyers: 0, totalHires: 0, totalRevenue: 0 }
  );
};