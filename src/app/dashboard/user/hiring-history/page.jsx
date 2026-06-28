import { getUserHiringHistory } from "@/lib/api/hiring";
import { getUserSession } from "@/lib/core/session";
import Link from "next/link";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  accepted: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

const UserHiringHistoryPage = async ({ params }) => {
  const { lawyerId } = params;
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
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-[Georgia,_serif] text-3xl font-extrabold text-[#11100C]">
          Hiring History
        </h1>
        <p className="text-[#6b6b6b] text-sm mt-1">
          Track all your lawyer hiring requests and payments
        </p>
      </div>

      {hiringHistory.length === 0 ? (
        <div className="rounded-[24px] border border-[#f0f0f0] bg-white p-10 text-center">
          <p className="text-[#6b6b6b]">
            You haven t sent any hiring requests yet.
          </p>
        </div>
      ) : (
        <div className="rounded-[24px] border border-[#f0f0f0] bg-white overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f7f4] border-b border-[#f0f0f0]">
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#9b9b9b]">
                  Lawyer
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#9b9b9b]">
                  Specialization
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#9b9b9b]">
                  Fee
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#9b9b9b]">
                  Hiring Date
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#9b9b9b]">
                  Status
                </th>
                <th className="py-4 px-5 text-[11px] font-extrabold uppercase tracking-[1px] text-[#9b9b9b]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {hiringHistory.map((request) => (
                <tr
                  key={request._id}
                  className="border-b border-[#f4f4f4] last:border-none hover:bg-[#fafafa] transition-colors"
                >
                  <td className="py-4 px-5 font-bold text-[#11100C]">
                    {request.lawyerName}
                  </td>
                  <td className="py-4 px-5 text-[#6b6b6b]">
                    {request.specialization}
                  </td>
                  <td className="py-4 px-5 font-semibold text-[#11100C]">
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
                      <span className="text-[12px] text-[#9b9b9b]">
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
                        <form action="/api/checkout" method="POST">
                          <input
                            type="hidden"
                            name="hiringRequest_Id"
                            value={request._id}
                          />
                          <Link
                            href={`/payments/${request._id}`}
                            className="rounded-xl bg-[#11100C] px-5 py-2 text-[12px] font-bold uppercase tracking-[0.5px] text-white transition hover:bg-[#AF8752]"
                          >
                            Pay
                          </Link>
                        </form>
                      )}

                    {request.paymentStatus === "paid" && (
                      <div className="flex items-center gap-3">
                        <span className="rounded-xl bg-green-50 border border-green-200 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.5px] text-green-700">
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
