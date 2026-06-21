"use client";
import { useSession } from "@/lib/auth-client";
import React from "react";
// import ManageLegalProfile from "./manage-legal-profile/ManageLegalProfile";

const LawyerDashboardHomePage = () => {
  const { data: session, ispending } = useSession();
  // const user = session?.user
  if (ispending) {
    return <div>
      Loading...
    </div>
  }
  return <div>
    I am a Lawer of Client side  ! http://localhost:3000/dashboard/lawyer
    <div>
      {/* <ManageLegalProfile></ManageLegalProfile> */}
    </div>
  </div>;
};

export default LawyerDashboardHomePage;
