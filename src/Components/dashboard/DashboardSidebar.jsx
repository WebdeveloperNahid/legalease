import { getUserSession } from "@/lib/core/session";
import DashboardSidebarClient from "./DashboardSidebarClient";

export async function DashboardSidebar() {
  const user = await getUserSession();

  return (
    <DashboardSidebarClient
      role={String(user?.role || "user").toLowerCase()}
      name={user?.name || ""}
      email={user?.email || ""}
      image={user?.image || ""}
    />
  );
}