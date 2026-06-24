import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";

const HiringPage = async () => {
  const user = getUserSession();
  if(!user) {
    redirect("/signin")
  }

  return <div>Hiring Page</div>;
};

export default HiringPage;
