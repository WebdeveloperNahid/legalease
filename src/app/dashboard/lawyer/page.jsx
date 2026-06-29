"use client";

import PublishingPaymentCard from "@/Components/PublishingPaymentCard";
import { getPublishingStatus } from "@/lib/api/payments";
// import { getPublishingStatus } from "@/lib/actions/users";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

const LawyerDashboardHomePage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [publishingPaid, setPublishingPaid] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    getPublishingStatus(user.email)
      .then((data) => {
        setPublishingPaid(data?.publishingPaid || false);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [user?.email]);

  if (isPending || checking) return <div>Loading...</div>;

  // Payment না করলে Card দেখাবে
  if (user?.role === "lawyer" && !publishingPaid) {
    return <PublishingPaymentCard />;
  }

  // Payment হলে Dashboard
  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-50 min-h-screen">
      <div className="border-b-2 border-[#556B2F] pb-6 mb-8">
        <h1 className="text-4xl font-extrabold text-[#556B2F]">
          Welcome back, <span className="text-[#D4AF37]">{user?.name}</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600 font-medium">
          Your professional lawyer account has been verified and is active.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#556B2F]/20 p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-[#556B2F] mb-4">Account Status</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#556B2F]"></span>
            </span>
            <span className="text-gray-700 font-semibold">Verified Professional</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Your credentials are up to date. You are eligible to accept new case inquiries.
          </p>
        </div>

        <div className="rounded-2xl border border-[#D4AF37]/30 p-6 bg-[#556B2F] text-white shadow-lg">
          <h2 className="text-xl font-bold text-[#D4AF37] mb-4">Quick Actions</h2>
          <ul className="space-y-3">
            <li className="cursor-pointer hover:text-[#D4AF37] transition-colors">→ Manage Active Cases</li>
            <li className="cursor-pointer hover:text-[#D4AF37] transition-colors">→ Update Profile Details</li>
            <li className="cursor-pointer hover:text-[#D4AF37] transition-colors">→ View Client Inquiries</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-200 text-center">
        <p className="text-sm text-gray-400 italic">
          Justice is the constant and perpetual will to allot to every man his due.
        </p>
      </div>
    </div>
  );
};

export default LawyerDashboardHomePage;