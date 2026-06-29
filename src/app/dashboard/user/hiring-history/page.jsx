import { getUserHiringHistory } from "@/lib/api/hiring";
import { getUserSession } from "@/lib/core/session";
import Link from "next/link";

const statusStyles = {
  pending: "bg-[#FFD500]/15 text-[#8a6d00] border border-[#FFD500]/40",
  accepted: "bg-[#556B2F]/10 text-[#556B2F] border border-[#556B2F]/30",
  rejected: "bg-red-50 text-red-600 border border-red-200",
};

const UserHiringHistoryPage = async () => {
  const user = await getUserSession();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#6b6b6b]">
          Please log in to view your hiring history.
        </p>
      </div>
    );
  }

  const hiringHistory = (await getUserHiringHistory(user.id)) || [];

  return (
    <div className="p-6 md:p-10 bg-[#f8f7f4] min-h-screen">
      <div className="mb-6">
        <h1 className="font-[Georgia,_serif] text-3xl font-extrabold text-[#11100C]">
          Hiring History
        </h1>
        <p className="text-[#6b6b6b] text-sm mt-1">
          Track all your lawyer hiring requests and payments
        </p>
      </div>

      {/* 🔐 Logged-in account confirmation banner */}
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-[#556B2F]/15 bg-[#556B2F]/5 px-5 py-3 w-fit">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#556B2F]/10 text-[13px] font-extrabold text-[#556B2F]">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="text-[12px] font-bold text-[#11100C]">
            Logged in as {user?.name}
          </p>
          <p className="text-[11px] text-[#6b6b6b]">{user?.email}</p>
        </div>
      </div>

      {hiringHistory.length === 0 ? (
        <div className="rounded-[24px] border border-[#556B2F]/10 bg-white p-10 text-center">
          <p className="text-[#6b6b6b]">
            You haven&apos;t sent any hiring requests yet.
          </p>
        </div>
      ) : (
        <div className="rounded-[24px] border-2 border-[#556B2F]/10 bg-white overflow-hidden shadow-[0_8px_30px_rgba(85,107,47,0.08)] relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#556B2F] to-[#FFD500]" />

          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#556B2F]/5 border-b border-[#556B2F]/10">
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#556B2F]/70">
                  Lawyer
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#556B2F]/70">
                  Specialization
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#556B2F]/70">
                  Fee
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#556B2F]/70">
                  Hiring Date
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#556B2F]/70">
                  Status
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#556B2F]/70">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {hiringHistory.map((request, i) => (
                <tr
                  key={request._id}
                  className={`border-b border-[#f4f4f4] last:border-none transition-colors hover:bg-[#556B2F]/[0.03] ${
                    i % 2 === 0 ? "bg-white" : "bg-[#fafaf7]"
                  }`}
                >
                  <td className="py-4 px-5 font-bold text-[#11100C]">
                    {request.lawyerName}
                  </td>
                  <td className="py-4 px-5 text-[#6b6b6b]">
                    {request.specialization}
                  </td>
                  <td className="py-4 px-5 font-semibold text-[#556B2F]">
                    ${request.fee}
                  </td>
                  <td className="py-4 px-5 text-[#6b6b6b] text-sm">
                    {new Date(request.requestDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold capitalize ${
                        statusStyles[request.status] ||
                        "bg-gray-50 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    {request.status === "pending" && (
                      <span className="text-[12px] text-[#9b9b9b] italic">
                        Waiting for lawyer
                      </span>
                    )}

                    {request.status === "rejected" && (
                      <span className="text-[12px] font-semibold text-red-500">
                        Rejected
                      </span>
                    )}

                    {request.status === "accepted" &&
                      request.paymentStatus !== "paid" && (
                        <Link
                          href={`/payments/${request._id}`}
                          className="rounded-xl bg-[#556B2F] px-5 py-2 text-[12px] font-bold uppercase tracking-[0.5px] text-white transition hover:bg-[#3e4d22] shadow-sm"
                        >
                          Pay
                        </Link>
                      )}

                    {request.paymentStatus === "paid" && (
                      <div className="flex items-center gap-3">
                        <span className="rounded-xl bg-[#556B2F]/10 border border-[#556B2F]/30 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.5px] text-[#556B2F]">
                          Paid
                        </span>
                        <a
                          href={`/payments/success/paidinfo?hiringRequestId=${request._id}`}
                          className="text-[12px] font-semibold text-[#AF8752] underline hover:text-[#8e6e42]"
                        >
                          Receipt
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserHiringHistoryPage;