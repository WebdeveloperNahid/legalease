// app/dashboard/lawyer/hiring-history/page.jsx

import { FaCheck, FaXmark, FaInbox } from "react-icons/fa6";
import { updateHiringStatus } from "@/lib/actions/hiring";
import { getLawyerHiringHistory } from "@/lib/api/hiring";
import { getUserSession } from "@/lib/core/session";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B | Gold Light #F3D98B
  সাদা background-এ gold লেখা #8A6A1C | Cream #FBF6EA | Beige #E8DCC8
  Border #DCE3EE | Pill #EAF0F9
  Status: pending কমলা #B45309 | accepted সবুজ #15803D | rejected লাল #B91C1C
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default async function LawyerHiringHistory() {
  const user = await getUserSession();
  const lawyerId = user.id;

  const data = await getLawyerHiringHistory(lawyerId);
  const requests = Array.isArray(data) ? data : [];

  // Header-এর summary গোনা (unknown status pending ধরা হয়, badge-এর মতোই)
  const counts = { pending: 0, accepted: 0, rejected: 0 };
  requests.forEach((req) => {
    const key = STATUS_CONFIG[req.status] ? req.status : "pending";
    counts[key] += 1;
  });

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)]">
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] to-[#14213D] px-6 py-8 sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-56 w-80 rounded-full bg-[#E2B93B]/10 blur-[90px]"
          />

          <div className="relative">
            <h1
              className="text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl"
              style={headingFont}
            >
              Hiring history
            </h1>
            <div
              aria-hidden="true"
              className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              Review and respond to incoming client requests
            </p>

            {requests.length > 0 && (
              <dl className="mt-6 flex flex-wrap gap-3">
                <Stat label="Total" value={requests.length} />
                <Stat label="Pending" value={counts.pending} />
                <Stat label="Accepted" value={counts.accepted} />
                <Stat label="Rejected" value={counts.rejected} />
              </dl>
            )}
          </div>
        </header>

        {/* ---------- Body ---------- */}
        {requests.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop / Tablet: table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Client hiring requests and their status
                </caption>
                <thead>
                  <tr className="border-b border-[#DCE3EE] bg-[#F3F6FB]">
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
            </div>

            {/* Mobile: card list */}
            <ul className="divide-y divide-[#E6ECF5] md:hidden">
              {requests.map((req, i) => (
                <RequestCard key={req._id} req={req} index={i} />
              ))}
            </ul>

            <div className="border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-3 text-xs text-[#475569]">
              {requests.length} {requests.length === 1 ? "request" : "requests"}{" "}
              total
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Small layout helpers ───────────────────────────────────────

function Stat({ label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
      <dt className="text-xs text-[#E8DCC8]/85">{label}</dt>
      <dd
        className="text-sm font-bold text-[#F3D98B]"
        style={headingFont}
      >
        {value}
      </dd>
    </div>
  );
}

function Th({ children }) {
  return (
    <th
      scope="col"
      className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#475569]"
    >
      {children}
    </th>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14213D] text-2xl text-[#E2B93B]">
        <FaInbox aria-hidden="true" />
      </div>
      <h3
        className="mt-6 text-2xl font-bold tracking-[-0.01em] text-[#14213D]"
        style={headingFont}
      >
        No hiring requests yet
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#475569]">
        When clients send requests, they will appear here.
      </p>
    </div>
  );
}

// ── Shared formatting ───────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Table row (desktop / tablet) ───────────────────────────────

function RequestRow({ req, index }) {
  return (
    <tr className="border-b border-[#E6ECF5] transition-colors duration-200 hover:bg-[#F8FAFD]">
      <td className="px-5 py-4 text-sm font-medium text-[#475569]">
        {String(index + 1).padStart(2, "0")}
      </td>

      <td className="px-5 py-4">
        <ClientInfo req={req} />
      </td>

      <td className="px-5 py-4 text-[#14213D]">{formatDate(req.requestDate)}</td>

      <td className="px-5 py-4">
        <StatusBadge status={req.status} />
      </td>

      <td className="px-5 py-4">
        {req.status === "pending" ? (
          <ActionButtons requestId={req._id} />
        ) : (
          <span className="text-sm text-[#64748B]">No action needed</span>
        )}
      </td>
    </tr>
  );
}

// ── Card (mobile) ───────────────────────────────────────────────

function RequestCard({ req, index }) {
  return (
    <li className="space-y-4 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <ClientInfo req={req} />
        <span className="shrink-0 text-xs font-medium text-[#475569]">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status={req.status} />
        <p className="text-sm text-[#14213D]">
          <span className="text-[#475569]">Requested </span>
          {formatDate(req.requestDate)}
        </p>
      </div>

      {req.status === "pending" && (
        <ActionButtons requestId={req._id} fullWidth />
      )}
    </li>
  );
}

// ── Client info (avatar + name + email) ────────────────────────

function ClientInfo({ req }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={req.userName || "?"} />
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#14213D]">
          {req.userName || "Unknown"}
        </p>
        <p className="mt-0.5 max-w-[220px] truncate text-xs text-[#475569] sm:max-w-[260px]">
          {req.userEmail || ""}
        </p>
      </div>
    </div>
  );
}

// ── Accept / Reject buttons ────────────────────────────────────

function ActionButtons({ requestId, fullWidth = false }) {
  const baseBtn = `inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 ${focusRing} ${
    fullWidth ? "w-full" : ""
  }`;

  return (
    <div className="flex items-center gap-2">
      <form
        action={updateHiringStatus.bind(null, requestId, "accepted")}
        className={fullWidth ? "flex-1" : ""}
      >
        <button
          type="submit"
          className={`${baseBtn} border-[#14213D] bg-[#14213D] text-[#FBF6EA] hover:border-[#E2B93B] hover:bg-[#E2B93B] hover:text-[#0B1526]`}
        >
          <FaCheck aria-hidden="true" className="text-xs" />
          Accept
        </button>
      </form>
      <form
        action={updateHiringStatus.bind(null, requestId, "rejected")}
        className={fullWidth ? "flex-1" : ""}
      >
        <button
          type="submit"
          className={`${baseBtn} border-[#B91C1C]/40 bg-white text-[#B91C1C] hover:border-[#B91C1C] hover:bg-[#B91C1C] hover:text-[#FBF6EA]`}
        >
          <FaXmark aria-hidden="true" className="text-xs" />
          Reject
        </button>
      </form>
    </div>
  );
}

// ── Avatar ──────────────────────────────────────────────────────

function Avatar({ name }) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-xs font-bold text-[#E2B93B] ring-2 ring-[#E2B93B]/40"
      style={headingFont}
    >
      {initials}
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "border-[#B45309]/30 bg-[#B45309]/[0.08] text-[#B45309]",
    dot: "bg-[#B45309]",
  },
  accepted: {
    label: "Accepted",
    badge: "border-[#15803D]/30 bg-[#15803D]/[0.08] text-[#15803D]",
    dot: "bg-[#15803D]",
  },
  rejected: {
    label: "Rejected",
    badge: "border-[#B91C1C]/30 bg-[#B91C1C]/[0.08] text-[#B91C1C]",
    dot: "bg-[#B91C1C]",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.badge}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}