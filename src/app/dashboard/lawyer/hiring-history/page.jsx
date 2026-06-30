// app/dashboard/lawyer/hiring-history/page.jsx

import { updateHiringStatus } from "@/lib/actions/hiring";
import { getLawyerHiringHistory } from "@/lib/api/hiring";
import { getUserSession } from "@/lib/core/session";

// import { getLawyerHiringHistory, updateHiringStatus } from "@/lib/actions/hiring.actions";
// import { auth } from "@/auth";

export default async function LawyerHiringHistory() {
  const user = await getUserSession();
  console.log("USER:", user); // ← add করো

  const lawyerId = user.id;
  console.log("LAWYER ID:", lawyerId);

  const data = await getLawyerHiringHistory(lawyerId);
  console.log("DATA FROM ACTION:", data); // ← এটা add করো — এটাই key

  const requests = Array.isArray(data) ? data : [];
  console.log("FINAL REQUESTS:", requests); // ← এটাও add করো

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Hiring history</h1>
        <p className="text-sm text-gray-400 mt-1">
          Review and respond to incoming client requests
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-[#111827] border border-gray-700 rounded-xl p-16 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="text-base font-medium text-white mb-1">
            No hiring requests yet
          </h3>
          <p className="text-sm text-gray-400">
            When clients send requests, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#111827] border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Request date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr
                  key={req._id}
                  className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-4 text-sm text-gray-500 font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.userName || "?"} />
                      <div>
                        <p className="font-semibold text-white">
                          {req.userName || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {req.userEmail || ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-gray-300">
                    {req.requestDate
                      ? new Date(req.requestDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={req.status} />
                  </td>

                  <td className="px-4 py-4">
                    {req.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <form
                          action={updateHiringStatus.bind(
                            null,
                            req._id,
                            "accepted",
                          )}
                        >
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg border border-gray-600 bg-transparent text-white hover:border-green-500 hover:text-green-400 transition-all cursor-pointer"
                          >
                            ✓ Accept
                          </button>
                        </form>
                        <form
                          action={updateHiringStatus.bind(
                            null,
                            req._id,
                            "rejected",
                          )}
                        >
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg border border-gray-600 bg-transparent text-white hover:border-red-500 hover:text-red-400 transition-all cursor-pointer"
                          >
                            ✕ Reject
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        No action needed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-700 text-xs text-gray-500">
            {requests.length} requests total
          </div>
        </div>
      )}
    </div>
  );
}

// ── Avatar ──────────────────────────────────────────────────────

const COLORS = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-green-600",
  "bg-rose-600",
  "bg-orange-500",
  "bg-teal-600",
];

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colorIndex =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${COLORS[colorIndex]}`}
    >
      {initials}
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    pending: {
      dot: "bg-yellow-400",
      text: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/30",
      label: "Pending",
    },
    accepted: {
      dot: "bg-green-400",
      text: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/30",
      label: "Accepted",
    },
    rejected: {
      dot: "bg-red-400",
      text: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/30",
      label: "Rejected",
    },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.border} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
