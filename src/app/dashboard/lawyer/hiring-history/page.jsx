// app/dashboard/lawyer/hiring-history/page.jsx

import { updateHiringStatus } from "@/lib/actions/hiring";
import { getLawyerHiringHistory } from "@/lib/api/hiring";
import { getUserSession } from "@/lib/core/session";

export default async function LawyerHiringHistory() {
  const user = await getUserSession();
  const lawyerId = user.id;

  const data = await getLawyerHiringHistory(lawyerId);
  const requests = Array.isArray(data) ? data : [];
  console.log(requests, "8798790708098       requiest db------=-=-=-=-=-")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-green-500">Hiring history</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and respond to incoming client requests
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-gradient-to-br from-green-800 to-green-900 border border-green-700/50 rounded-xl overflow-hidden shadow-lg shadow-green-950/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-green-700/50 bg-black/10">
                <Th>#</Th>
                <Th>Client</Th>
                <Th>Request date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <RequestRow key={req._id} req={req} index={i} />
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-green-700/50 bg-black/10 text-xs text-green-200/70">
            {requests.length} requests total
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small layout helpers ───────────────────────────────────────

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-green-200/80 uppercase tracking-wider">
      {children}
    </th>
  );
}

function EmptyState() {
  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl p-16 text-center">
      <p className="text-4xl mb-3">📭</p>
      <h3 className="text-base font-medium text-white mb-1">No hiring requests yet</h3>
      <p className="text-sm text-gray-400">
        When clients send requests, they will appear here.
      </p>
    </div>
  );
}

// ── Table row ───────────────────────────────────────────────────

function RequestRow({ req, index }) {
  return (
    <tr className="border-b border-green-700/40 hover:bg-black/10 transition-colors">
      <td className="px-4 py-4 text-sm text-green-200/60 font-medium">
        {String(index + 1).padStart(2, "0")}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={req.userName || "?"} />
          <div>
            <p className="font-semibold text-white">{req.userName || "Unknown"}</p>
            <p className="text-xs text-green-200/60 mt-0.5">{req.userEmail || ""}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-green-100">
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
          <ActionButtons requestId={req._id} />
        ) : (
          <span className="text-sm text-green-200/50 italic">No action needed</span>
        )}
      </td>
    </tr>
  );
}

// ── Accept / Reject buttons ────────────────────────────────────

function ActionButtons({ requestId }) {
  const baseBtn =
    "flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg border transition-all cursor-pointer";

  return (
    <div className="flex items-center gap-2">
      <form action={updateHiringStatus.bind(null, requestId, "accepted")}>
        <button
          type="submit"
          className={`${baseBtn} border-green-400/40 bg-white/5 text-green-300 hover:bg-green-400 hover:text-green-950 hover:border-green-400`}
        >
          ✓ Accept
        </button>
      </form>
      <form action={updateHiringStatus.bind(null, requestId, "rejected")}>
        <button
          type="submit"
          className={`${baseBtn} border-red-400/40 bg-white/5 text-pink-950 hover:bg-red-400 hover:text-red-950 hover:border-red-400`}
        >
          ✕ Reject
        </button>
      </form>
    </div>
  );
}

// ── Avatar ──────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-teal-500",
];

function Avatar({ name }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const colorIndex = name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_COLORS.length;

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ring-2 ring-white/10 ${AVATAR_COLORS[colorIndex]}`}
    >
      {initials}
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "bg-yellow-400 text-yellow-950",
    dot: "bg-yellow-700",
  },
  accepted: {
    label: "Accepted",
    badge: "bg-white text-green-800",
    dot: "bg-green-600",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-red-400 text-red-950",
    dot: "bg-red-800",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${s.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}