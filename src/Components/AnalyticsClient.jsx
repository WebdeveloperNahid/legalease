"use client";

import { User, useResizeObserver } from "@gravity-ui/uikit";


import { FaHandshake, FaScaleUnbalanced } from "react-icons/fa6";
import { FiDollarSign } from "react-icons/fi";

export default function AnalyticsClient({ stats }) {
  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: User,
    },
    {
      label: "Total Lawyers",
      value: stats.totalLawyers,
      icon: FaScaleUnbalanced,
    },
    {
      label: "Total Hires",
      value: stats.totalHires,
      icon: FaHandshake,
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue}`,
      icon: FiDollarSign,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-10 font-sans sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[900px]">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-[#AF8752]">
          Admin
        </p>
        <h1 className="mb-8 font-[Georgia,_serif] text-[24px] font-extrabold text-[#11100C] sm:text-[28px]">
          Analytics Overview
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-[20px] border border-[#eee5d3] bg-white p-5 sm:p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f4] text-[#AF8752]">
                <Icon size={18} strokeWidth={2} />
              </div>
              <p className="font-[Georgia,_serif] text-[24px] font-extrabold leading-none text-[#11100C] sm:text-[28px]">
                {value}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[1px] text-[#8a8578]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}