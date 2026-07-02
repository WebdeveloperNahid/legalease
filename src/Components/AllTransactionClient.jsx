"use client";

import { BiReceipt } from "react-icons/bi";
import { BsArrowDownLeft, BsReceipt } from "react-icons/bs";
import { FiArrowUpRight } from "react-icons/fi";



const typeStyles = {
  hiring: {
    label: "Hiring",
    icon: FiArrowUpRight,
    badge: "bg-[#E9E3F7] text-[#4B2E9E]",
  },
  publishing: {
    label: "Publishing",
    icon: BsArrowDownLeft,
    badge: "bg-[#FFF4CC] text-[#7A5B00]",
  },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TypeBadge({ type }) {
  const meta = typeStyles[type] || {
    label: type || "Payment",
    icon: BiReceipt,
    badge: "bg-[#f0ede4] text-[#8a8578]",
  };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.5px] ${meta.badge}`}
    >
      <Icon size={11} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

export default function AllTransactionsClient({ transactions = [] }) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-10 font-sans sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-[#AF8752]">
              Admin
            </p>
            <h1 className="font-[Georgia,_serif] text-[24px] font-extrabold text-[#11100C] sm:text-[28px]">
              All Transactions
            </h1>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#eee5d3] bg-white px-4 py-2 text-[11px] font-bold text-[#8a8578] sm:flex">
            <BsReceipt size={14} className="text-[#AF8752]" />
            {transactions.length} total
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-[20px] border border-[#eee5d3] bg-white p-12 text-center text-[13px] text-[#8a8578]">
            No transactions found.
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden overflow-hidden rounded-[20px] border border-[#eee5d3] bg-white sm:block">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#eee5d3] text-[11px] uppercase tracking-[1px] text-[#8a8578]">
                    <th className="px-5 py-4">Transaction ID</th>
                    <th className="px-5 py-4">User / Lawyer Email</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b border-[#f3efe4] transition hover:bg-[#faf9f5] last:border-0"
                    >
                      <td className="px-5 py-4 align-top">
                        <p className="font-mono text-[11px] text-[#AF8752]">
                          {t._id}
                        </p>
                        <div className="mt-1.5">
                          <TypeBadge type={t.paymentType} />
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-[#11100C]">
                        {t.lawyerEmail || t.email || "—"}
                      </td>
                      <td className="px-5 py-4 align-top font-bold text-[#11100C]">
                        ${t.fee ?? "—"}
                        <span className="ml-1 text-[10px] font-normal uppercase text-[#8a8578]">
                          {t.currency}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top text-[#8a8578]">
                        {formatDate(t.createdAt || t.paidAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="flex flex-col gap-3 sm:hidden">
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="rounded-[18px] border border-[#eee5d3] bg-white p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate font-mono text-[10px] text-[#AF8752]">
                      {t._id}
                    </p>
                    <TypeBadge type={t.paymentType} />
                  </div>

                  <p className="truncate text-[13px] font-bold text-[#11100C]">
                    {t.lawyerEmail || t.email || "—"}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#f3efe4] pt-3">
                    <span className="text-[11px] text-[#8a8578]">
                      {formatDate(t.createdAt || t.paidAt)}
                    </span>
                    <span className="text-[15px] font-extrabold text-[#11100C]">
                      ${t.fee ?? "—"}
                      <span className="ml-1 text-[10px] font-normal uppercase text-[#8a8578]">
                        {t.currency}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}