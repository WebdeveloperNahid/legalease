import { FaCircleCheck, FaCreditCard, FaInbox, FaLock } from "react-icons/fa6";
import { getUserHiringHistory } from "@/lib/api/hiring";
import { getUserSession } from "@/lib/core/session";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  সাদা background-এ gold লেখা #8A6A1C | Cream #FBF6EA | Beige #E8DCC8
  Border #DCE3EE | Pill #EAF0F9 | Tint #F3F6FB
  Status: pending কমলা #B45309 | accepted সবুজ #15803D | rejected লাল #B91C1C
*/

const CURRENCY = "$"; // Lawyer profile ও Browse card-এর সাথে একই রাখুন

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

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

export default async function UserHiringHistory() {
  const user = await getUserSession();
  const data = await getUserHiringHistory(user?.id);
  const requests = Array.isArray(data) ? data : [];

  // Header-এর summary গোনা (unknown status pending ধরা হয়, badge-এর মতোই)
  const counts = { pending: 0, accepted: 0, rejected: 0, paid: 0 };
  requests.forEach((req) => {
    const key = STATUS_CONFIG[req.status] ? req.status : "pending";
    counts[key] += 1;
    if (req.paymentStatus === "paid") counts.paid += 1;
  });

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)]">
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-6 py-8 sm:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-56 w-80 rounded-full bg-[#E2B93B]/10 blur-[90px]"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
                My requests
              </span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl"
              style={headingFont}
            >
              Hiring history
            </h1>
            <div
              aria-hidden="true"
              className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              Track the lawyers you&apos;ve contacted and how they responded
            </p>

            {requests.length > 0 && (
              <dl className="mt-6 flex flex-wrap gap-3">
                <Stat label="Total" value={requests.length} />
                <Stat label="Pending" value={counts.pending} />
                <Stat label="Accepted" value={counts.accepted} />
                <Stat label="Rejected" value={counts.rejected} />
                <Stat label="Paid" value={counts.paid} />
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
                  Your hiring requests, their status and payment actions
                </caption>
                <thead>
                  <tr className="border-b border-[#DCE3EE] bg-[#F3F6FB]">
                    <Th>#</Th>
                    <Th>Lawyer</Th>
                    <Th>Specialization</Th>
                    <Th>Fee</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, i) => (
                    <RequestRow key={String(req._id)} req={req} index={i} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: card list */}
            <ul className="divide-y divide-[#E6ECF5] md:hidden">
              {requests.map((req, i) => (
                <RequestCard key={String(req._id)} req={req} index={i} />
              ))}
            </ul>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-3 text-xs text-[#475569]">
              <span>
                {requests.length} {requests.length === 1 ? "request" : "requests"}{" "}
                total
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FaLock aria-hidden="true" className="text-[#8A6A1C]" />
                Secure checkout powered by Stripe
              </span>
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
      <dd className="text-sm font-bold text-[#F3D98B]" style={headingFont}>
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
        When you hire a lawyer, your requests will appear here.
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

function Fee({ value }) {
  const hasFee = value !== undefined && value !== null && value !== "";
  if (!hasFee) return <span className="text-[#64748B]">—</span>;
  return (
    <span className="font-semibold text-[#0B1526]">
      {CURRENCY}
      {value}
      <span className="ml-0.5 text-xs font-medium text-[#64748B]">/hr</span>
    </span>
  );
}

function SpecPill({ children }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full bg-[#EAF0F9] px-3 py-1 text-xs font-medium text-[#14213D]">
      <span className="truncate">{children}</span>
    </span>
  );
}

// ── Table row (desktop / tablet) ───────────────────────────────

function RequestRow({ req, index }) {
  return (
    <tr className="border-b border-[#E6ECF5] transition-colors duration-200 hover:bg-[#F8FAFD]">
      <td className="px-5 py-4 text-sm font-medium text-[#475569]">
        {String(index + 1).padStart(2, "0")}
      </td>
      <td className="px-5 py-4">
        <LawyerInfo name={req.lawyerName} />
      </td>
      <td className="px-5 py-4">
        {req.specialization ? (
          <SpecPill>{req.specialization}</SpecPill>
        ) : (
          <span className="text-[#64748B]">—</span>
        )}
      </td>
      <td className="px-5 py-4">
        <Fee value={req.fee} />
      </td>
      <td className="px-5 py-4 text-[#14213D]">{formatDate(req.requestDate)}</td>
      <td className="px-5 py-4">
        <StatusBadge status={req.status} />
      </td>
      <td className="px-5 py-4">
        <ActionCell req={req} />
      </td>
    </tr>
  );
}

// ── Card (mobile) ───────────────────────────────────────────────

function RequestCard({ req, index }) {
  return (
    <li className="space-y-4 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <LawyerInfo name={req.lawyerName} spec={req.specialization} />
        <span className="shrink-0 text-xs font-medium text-[#475569]">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#475569]">
            Fee
          </p>
          <p className="mt-1 text-sm">
            <Fee value={req.fee} />
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#475569]">
            Requested
          </p>
          <p className="mt-1 text-sm text-[#14213D]">{formatDate(req.requestDate)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status={req.status} />
      </div>

      <ActionCell req={req} fullWidth />
    </li>
  );
}

// ── Lawyer info (avatar + name + optional specialization) ──────

function LawyerInfo({ name, spec }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name || "?"} />
      <div className="min-w-0">
        <p className="truncate font-semibold capitalize text-[#14213D]">
          {name || "Unknown"}
        </p>
        {spec && (
          <p className="mt-0.5 max-w-[220px] truncate text-xs text-[#475569]">
            {spec}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Action: Paid / Pay Now / info text ─────────────────────────

function ActionCell({ req, fullWidth = false }) {
  if (req.paymentStatus === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B7E4C7] bg-[#ECFDF3] px-3 py-1.5 text-xs font-semibold text-[#166534]">
        <FaCircleCheck aria-hidden="true" />
        Paid
      </span>
    );
  }

  if (req.status === "accepted") {
    return <PayNowButton requestId={req._id} fullWidth={fullWidth} />;
  }

  return (
    <span className="text-sm text-[#64748B]">
      {req.status === "rejected" ? "No action needed" : "Waiting for lawyer"}
    </span>
  );
}

function PayNowButton({ requestId, fullWidth }) {
  return (
    <form
      action="/api/checkout_sessions"
      method="POST"
      className={fullWidth ? "w-full" : ""}
    >
      <input type="hidden" name="paymentType" value="hiring" />
      <input type="hidden" name="hiringRequest_Id" value={String(requestId)} />
      <button
        type="submit"
        className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] px-5 text-sm font-bold tracking-wide text-[#0B1526] shadow-[0_6px_18px_rgba(226,185,59,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(226,185,59,0.5)] active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 ${focusRing} ${
          fullWidth ? "w-full" : ""
        }`}
      >
        <FaCreditCard aria-hidden="true" className="text-xs" />
        Pay now
      </button>
    </form>
  );
}

// ── Avatar ──────────────────────────────────────────────────────

function Avatar({ name }) {
  const initials =
    String(name)
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