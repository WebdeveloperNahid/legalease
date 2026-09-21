"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBullhorn,
  FaCheck,
  FaCopy,
  FaHandshake,
  FaMagnifyingGlass,
  FaReceipt,
} from "react-icons/fa6";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8 | Border #DCE3EE | Pill #EAF0F9 | Tint #F3F6FB
  সাদা background-এ gold লেখা #8A6A1C
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

const TYPE_STYLE = {
  hiring: {
    label: "Hiring",
    Icon: FaHandshake,
    cls: "border-[#14213D]/15 bg-[#EAF0F9] text-[#14213D]",
  },
  publishing: {
    label: "Publishing",
    Icon: FaBullhorn,
    cls: "border-[#E2B93B]/60 bg-[#E2B93B]/15 text-[#8A6A1C]",
  },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "hiring", label: "Hiring" },
  { key: "publishing", label: "Publishing" },
];

const SORTS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "amount", label: "Highest amount" },
];

/* ---------- Helpers ---------- */
function typeKey(type) {
  return String(type || "").toLowerCase().trim();
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function money(v) {
  if (v === undefined || v === null || v === "") return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function txTime(t) {
  const d = new Date(t.createdAt || t.paidAt);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function txEmail(t) {
  return t.lawyerEmail || t.email || "";
}

/* ---------- ছোট UI অংশ ---------- */
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

function Th({ children, className = "" }) {
  return (
    <th
      scope="col"
      className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#475569] ${className}`}
    >
      {children}
    </th>
  );
}

function TypeBadge({ type }) {
  const key = typeKey(type);
  const meta = TYPE_STYLE[key] || {
    label: type || "Payment",
    Icon: FaReceipt,
    cls: "border-[#DCE3EE] bg-[#F3F6FB] text-[#475569]",
  };
  const { Icon } = meta;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${meta.cls}`}
    >
      <Icon aria-hidden="true" className="text-[10px]" />
      {meta.label}
    </span>
  );
}

function Avatar({ email }) {
  const letter = (email || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-xs font-bold text-[#E2B93B] ring-2 ring-[#E2B93B]/40"
      style={headingFont}
    >
      {letter}
    </div>
  );
}

function EmailInfo({ email }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar email={email} />
      <p className="min-w-0 truncate text-sm font-medium text-[#14213D]">
        {email || "—"}
      </p>
    </div>
  );
}

function Amount({ fee, currency, className = "" }) {
  return (
    <span className={`font-bold text-[#0B1526] ${className}`} style={headingFont}>
      {money(fee)}
      {currency && (
        <span className="ml-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
          {currency}
        </span>
      )}
    </span>
  );
}

function CopyId({ id, copied, onCopy, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onCopy(id)}
      aria-label={`Copy transaction ID ${id}`}
      title="Copy transaction ID"
      className={`group inline-flex max-w-full items-center gap-2 rounded-md text-left ${focusRing} ${className}`}
    >
      <span className="truncate font-mono text-[11px] text-[#8A6A1C]">{String(id)}</span>
      <span
        aria-hidden="true"
        className={`shrink-0 text-[10px] transition-colors ${
          copied ? "text-[#15803D]" : "text-slate-400 group-hover:text-[#8A6A1C]"
        }`}
      >
        {copied ? <FaCheck /> : <FaCopy />}
      </span>
    </button>
  );
}

/* ---------- Main ---------- */
export default function AllTransactionsClient({ transactions = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  // পেজ খোলার animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const counts = useMemo(() => {
    const c = { hiring: 0, publishing: 0 };
    transactions.forEach((t) => {
      const k = typeKey(t.paymentType);
      if (k in c) c[k] += 1;
    });
    return c;
  }, [transactions]);

  const totalAmount = useMemo(
    () => transactions.reduce((sum, t) => sum + toNumber(t.fee), 0),
    [transactions]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = transactions.filter((t) => {
      const okType = filter === "all" || typeKey(t.paymentType) === filter;
      const okText =
        !q ||
        String(t._id || "").toLowerCase().includes(q) ||
        txEmail(t).toLowerCase().includes(q);
      return okType && okText;
    });

    return [...list].sort((a, b) => {
      if (sort === "amount") return toNumber(b.fee) - toNumber(a.fee);
      if (sort === "oldest") return txTime(a) - txTime(b);
      return txTime(b) - txTime(a);
    });
  }, [transactions, search, filter, sort]);

  const visibleAmount = useMemo(
    () => visible.reduce((sum, t) => sum + toNumber(t.fee), 0),
    [visible]
  );

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(String(id));
      setCopiedId(id);
      toast.success("Transaction ID copied");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Couldn't copy. Please copy it manually.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
  };

  /* ================= Render ================= */
  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div
        className={`overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)] transition-all duration-500 ease-out motion-reduce:transition-none ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
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
                Admin dashboard
              </span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl"
              style={headingFont}
            >
              All transactions
            </h1>
            <div
              aria-hidden="true"
              className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              Every payment made across LegalEase
            </p>

            {transactions.length > 0 && (
              <dl className="mt-6 flex flex-wrap gap-3">
                <Stat label="Total" value={transactions.length} />
                <Stat label="Hiring" value={counts.hiring} />
                <Stat label="Publishing" value={counts.publishing} />
                <Stat label="Amount" value={money(totalAmount)} />
              </dl>
            )}
          </div>
        </header>

        {transactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14213D] text-2xl text-[#E2B93B]">
              <FaReceipt aria-hidden="true" />
            </div>
            <h2
              className="mt-6 text-2xl font-bold tracking-[-0.01em] text-[#14213D]"
              style={headingFont}
            >
              No transactions yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#475569]">
              When clients or lawyers make a payment, it will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* ---------- Toolbar: search + filter + sort ---------- */}
            <div className="space-y-3 border-b border-[#DCE3EE] bg-[#F3F6FB] px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative w-full md:max-w-sm">
                  <FaMagnifyingGlass
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                  />
                  <label htmlFor="tx-search" className="sr-only">
                    Search by email or transaction ID
                  </label>
                  <input
                    id="tx-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search email or transaction ID"
                    autoComplete="off"
                    className="h-11 w-full rounded-xl border border-[#DCE3EE] bg-white pl-11 pr-4 text-sm text-[#0B1526] outline-none transition placeholder:text-slate-400 focus:border-[#E2B93B] focus:ring-4 focus:ring-[#E2B93B]/20"
                  />
                </div>

                <div className="md:ml-auto">
                  <label htmlFor="tx-sort" className="sr-only">
                    Sort transactions
                  </label>
                  <select
                    id="tx-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-11 w-full cursor-pointer rounded-xl border border-[#DCE3EE] bg-white px-4 text-sm font-medium text-[#0B1526] outline-none transition focus:border-[#E2B93B] focus:ring-4 focus:ring-[#E2B93B]/20 md:w-auto"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                role="group"
                aria-label="Filter by payment type"
                className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
              >
                {FILTERS.map((f) => {
                  const active = filter === f.key;
                  const count = f.key === "all" ? transactions.length : counts[f.key];
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key)}
                      aria-pressed={active}
                      className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors duration-200 motion-reduce:transition-none ${focusRing} ${
                        active
                          ? "border-[#0B1526] bg-[#0B1526] text-[#FBF6EA]"
                          : "border-[#DCE3EE] bg-white text-[#14213D] hover:border-[#E2B93B]"
                      }`}
                    >
                      {f.label}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          active ? "bg-[#E2B93B] text-[#0B1526]" : "bg-[#EAF0F9] text-[#14213D]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#14213D] text-xl text-[#E2B93B]">
                  <FaMagnifyingGlass aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-[#14213D]" style={headingFont}>
                  No matching transactions
                </h2>
                <p className="mt-2 text-sm text-[#475569]">
                  Try a different email, ID or payment type.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`mt-5 inline-flex h-9 items-center justify-center rounded-lg border border-[#0B1526]/25 bg-white px-4 text-xs font-semibold text-[#0B1526] transition-colors hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA] ${focusRing}`}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Desktop / Tablet: table */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <caption className="sr-only">
                      All payments with transaction ID, type, email, amount and date
                    </caption>
                    <thead>
                      <tr className="border-b border-[#DCE3EE] bg-[#F3F6FB]">
                        <Th>Transaction ID</Th>
                        <Th>Type</Th>
                        <Th>User / Lawyer</Th>
                        <Th>Amount</Th>
                        <Th>Date</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((t) => (
                        <tr
                          key={String(t._id)}
                          className="border-b border-[#E6ECF5] transition-colors duration-200 hover:bg-[#F8FAFD] motion-reduce:transition-none"
                        >
                          <td className="max-w-[200px] px-5 py-4">
                            <CopyId
                              id={t._id}
                              copied={copiedId === t._id}
                              onCopy={copyId}
                            />
                          </td>
                          <td className="px-5 py-4">
                            <TypeBadge type={t.paymentType} />
                          </td>
                          <td className="max-w-[280px] px-5 py-4">
                            <EmailInfo email={txEmail(t)} />
                          </td>
                          <td className="px-5 py-4">
                            <Amount fee={t.fee} currency={t.currency} className="text-base" />
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-[#14213D]">
                            {formatDate(t.createdAt || t.paidAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: card list */}
                <ul className="space-y-3 bg-[#F3F6FB]/60 p-4 md:hidden">
                  {visible.map((t) => (
                    <li
                      key={String(t._id)}
                      className="relative overflow-hidden rounded-xl border border-[#DCE3EE] bg-white p-4"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
                      />

                      <div className="flex items-start justify-between gap-3 pl-2">
                        <TypeBadge type={t.paymentType} />
                        <Amount fee={t.fee} currency={t.currency} className="text-xl" />
                      </div>

                      <div className="mt-4 pl-2">
                        <EmailInfo email={txEmail(t)} />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E6ECF5] pt-3 pl-2">
                        <CopyId
                          id={t._id}
                          copied={copiedId === t._id}
                          onCopy={copyId}
                          className="min-w-0 flex-1"
                        />
                        <span className="shrink-0 text-xs text-[#475569]">
                          {formatDate(t.createdAt || t.paidAt)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-3 text-xs text-[#475569]">
              <span>
                Showing {visible.length} of {transactions.length}{" "}
                {transactions.length === 1 ? "transaction" : "transactions"}
              </span>
              <span className="font-semibold text-[#14213D]">
                Amount shown: {money(visibleAmount)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}