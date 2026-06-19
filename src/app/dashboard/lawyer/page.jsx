"use client";
import { useSession } from "@/lib/auth-client";
import React from "react";

const LawyerDashboardHomePage = () => {
  const { data: session, ispending } = useSession();
  const user = session?.user
  if (ispending) {
    return <div>
      Loading...
    </div>
  }
  return <div>I am a Lawer !  {user?.name} </div>;
};

export default LawyerDashboardHomePage;
