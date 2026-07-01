import { getUserHiringHistory } from "@/lib/api/hiring";
import { getUserSession } from "@/lib/core/session";

export default async function UserHiringHistory() {
  const user = await getUserSession();
  const userId = user?.id;

  const data = await getUserHiringHistory(userId);
  const requests = Array.isArray(data) ? data : [];

  return (
    <div className="p-6 bg-[#0f120d] min-h-screen text-gray-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#E8EDDF]">Hiring history</h1>
        <p className="text-sm text-gray-400 mt-2">
          Track the lawyers youve reached out to and their response status
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-[#1a2114] border border-[#556B2F]/30 rounded-2xl p-16 text-center">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-[#E8EDDF] mb-1">
            No hiring requests yet
          </h3>
          <p className="text-sm text-gray-400">
            When you hire a lawyer, your requests will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#1a2114] border border-[#556B2F]/20 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-sm">
            <thead className="bg-[#556B2F]/10">
              <tr className="border-b border-[#556B2F]/20">
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5f26c9] uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5f26c9] uppercase tracking-wider">
                  Lawyer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5f26c9] uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5f26c9] uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5f26c9] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5f26c9] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5f26c9] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#556B2F]/10">
              {requests.map((req, i) => (
                <tr
                  key={req._id}
                  className="hover:bg-[#556B2F]/5 transition-all"
                >
                  <td className="px-6 py-4 text-gray-400">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.lawyerName || "?"} />
                      <span className="font-medium text-white">
                        {req.lawyerName || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {req.specialization || "—"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#C5D86D]">
                    {req.fee != null ? `৳${req.fee}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {req.requestDate
                      ? new Date(req.requestDate).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    { req.paymentStatus === "paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        ✓ Paid
                      </span>
                    ) :   req.status === "accepted" ? (
                      <form action="/api/checkout_sessions" method="POST">
                        <input
                          type="hidden"
                          name="paymentType"
                          value="hiring"
                        />
                        <input
                          type="hidden"
                          name="hiringRequest_Id"
                          value={req._id}
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#556B2F] hover:bg-[#4a5e29] text-white rounded-lg font-medium transition-all shadow-lg"
                        >
                          Pay Now
                        </button>
                      </form>
                    ) : (
                      <span className="text-gray-500 italic text-xs capitalize">
                        {req.status}
                      </span>
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
}

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#1a2114] bg-[#C5D86D]">
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    accepted: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status] || styles.pending} uppercase`}
    >
      {status || "Pending"}
    </span>
  );
}
