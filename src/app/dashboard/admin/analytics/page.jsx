
import AnalyticsClient from "@/Components/AnalyticsClient";
import { getAnalyticsOverview } from "@/lib/api/analytics";

import { requireRole } from "@/lib/core/session";

const AnalyticsPage = async () => {
  await requireRole("admin");

  const stats = await getAnalyticsOverview();

  return <AnalyticsClient stats={stats} />;
};

export default AnalyticsPage;