"use client";

import React from "react";

const ClientPage = ({ user }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#556B2F] px-6 font-sans">
      <div className="text-center">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-[#AF8752]">
          Dashboard
        </p>
        <h1 className="font-[Georgia,_serif] text-[32px] font-extrabold text-[#11100C]">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="mt-3 text-[14px] text-[#8a8578]">
          This is your user home page.
        </p>
      </div>
    </div>
  );
};

export default ClientPage;