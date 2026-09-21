import { DashboardSidebar } from "@/Components/dashboard/DashboardSidebar";
import PublishingPaymentCard from "@/Components/PublishingPaymentCard";
import { getPublishingStatus } from "@/lib/api/payments";
import { getUserSession } from "@/lib/core/session";

const DashboardLayout = async ({ children }) => {
  const user = await getUserSession();
  const isLawyer = String(user?.role || "").toLowerCase() === "lawyer";

  // শুধু lawyer-এর জন্য payment check
  if (isLawyer) {
    let paid = false;
    try {
      const data = await getPublishingStatus(user.email);
      paid = Boolean(data?.publishingPaid);
    } catch (err) {
      console.error("Publishing status check failed:", err);
    }

    // Payment বাকি: sidebar নেই, শুধু Stripe card
    if (!paid) {
      return (
        <main className="min-h-screen">
          <PublishingPaymentCard />
        </main>
      );
    }
  }

  // Payment হয়েছে, অথবা lawyer না: আগের মতোই sidebar + page
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};

export default DashboardLayout;