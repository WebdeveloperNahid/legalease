"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChevronDown,
  FaMagnifyingGlass,
  FaSpinner,
  FaTrashCan,
  FaTriangleExclamation,
  FaUserShield,
  FaUsers,
  FaXmark,
} from "react-icons/fa6";
import { changeUserRole, deleteUser } from "@/lib/actions/manege-users";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8 | Border #DCE3EE | Pill #EAF0F9 | Tint #F3F6FB
  সাদা background-এ gold লেখা #8A6A1C
*/

const ROLES = ["user", "lawyer", "admin"];

const ROLE_STYLE = {
  admin: {
    label: "Admin",
    cls: "border-[#E2B93B]/60 bg-[#E2B93B]/15 text-[#8A6A1C]",
  },
  lawyer: {
    label: "Lawyer",
    cls: "border-[#14213D]/20 bg-[#EAF0F9] text-[#14213D]",
  },
  user: {
    label: "User",
    cls: "border-[#DCE3EE] bg-[#F3F6FB] text-[#475569]",
  },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "user", label: "Users" },
  { key: "lawyer", label: "Lawyers" },
  { key: "admin", label: "Admins" },
];

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

const btnBase = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 motion-reduce:transition-none ${focusRing}`;
const btnSm = `${btnBase} h-9 px-4 text-xs`;
const btnMd = `${btnBase} h-12 rounded-xl px-6 text-sm`;
const btnGold =
  "bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_6px_18px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(226,185,59,0.5)] disabled:shadow-none disabled:hover:translate-y-0";
const btnOutline =
  "border border-[#0B1526]/25 bg-white text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]";
const btnDanger =
  "border border-[#B91C1C]/40 bg-white text-[#B91C1C] hover:border-[#B91C1C] hover:bg-[#B91C1C] hover:text-white disabled:hover:bg-white disabled:hover:text-[#B91C1C]";
const btnDangerSolid = "bg-[#B91C1C] text-white hover:bg-[#991B1B]";

/* ---------- Helpers ---------- */
function roleKey(role) {
  const r = String(role || "user").toLowerCase().trim();
  return ROLE_STYLE[r] ? r : "user";
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

/* ---------- Modal (Escape, focus আটকানো, scroll বন্ধ, বন্ধ হলে focus ফেরা) ---------- */
function Modal({ open, onClose, titleId, size = "max-w-md", children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const el = ref.current;
    const focusables = () =>
      el
        ? Array.from(
            el.querySelectorAll(
              "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
            )
          )
        : [];

    focusables()[0]?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1526]/70 backdrop-blur-sm"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[90vh] w-full ${size} overflow-y-auto rounded-2xl border border-[#E2B93B]/30 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.45)]`}
      >
        <div
          aria-hidden="true"
          className="h-1.5 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
        />
        {children}
      </div>
    </div>
  );
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

/* ছবি, না থাকলে বা লোড না হলে নামের অক্ষর */
function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false);
  const initials =
    String(name || "?")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#14213D] ring-2 ring-[#E2B93B]/40">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-xs font-bold text-[#E2B93B]"
          style={headingFont}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

function UserInfo({ user, isSelf }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar src={user.image} name={user.name || user.email} />
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-semibold text-[#14213D]">
          <span className="truncate">{user.name || "Unknown"}</span>
          {isSelf && (
            <span className="shrink-0 rounded-full border border-[#E2B93B]/60 bg-[#E2B93B]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A6A1C]">
              You
            </span>
          )}
        </p>
        <p className="mt-0.5 max-w-[240px] truncate text-xs text-[#475569] sm:max-w-[300px]">
          {user.email || ""}
        </p>
      </div>
    </div>
  );
}

function RoleSelect({ user, disabled, busy, onChange }) {
  const key = roleKey(user.role);
  return (
    <div className="relative">
      <select
        aria-label={`Role for ${user.name || user.email}`}
        value={key}
        disabled={disabled}
        onChange={(e) => onChange(user, e.target.value)}
        className={`h-10 w-full cursor-pointer appearance-none rounded-lg border py-2 pl-3.5 pr-9 text-sm font-semibold outline-none transition focus:ring-4 focus:ring-[#E2B93B]/25 disabled:cursor-not-allowed disabled:opacity-60 ${ROLE_STYLE[key].cls}`}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_STYLE[r].label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px]"
      >
        {busy ? (
          <FaSpinner className="animate-spin motion-reduce:animate-none" />
        ) : (
          <FaChevronDown />
        )}
      </span>
    </div>
  );
}

/* ---------- Main ---------- */
export default function ManageUsersClient({ users: initialUsers = [], currentEmail = "" }) {
  const [users, setUsers] = useState(initialUsers);
  const [busyEmail, setBusyEmail] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null); // { user, newRole } (admin বানানোর আগে confirm)
  const [confirming, setConfirming] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const me = String(currentEmail || "").toLowerCase();
  const isSelf = (u) => !!me && String(u.email || "").toLowerCase() === me;

  const counts = useMemo(() => {
    const c = { user: 0, lawyer: 0, admin: 0 };
    users.forEach((u) => {
      c[roleKey(u.role)] += 1;
    });
    return c;
  }, [users]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const okRole = filter === "all" || roleKey(u.role) === filter;
      const okText =
        !q ||
        String(u.name || "").toLowerCase().includes(q) ||
        String(u.email || "").toLowerCase().includes(q);
      return okRole && okText;
    });
  }, [users, search, filter]);

  const hasDates = users.some((u) => u.createdAt);

  /* ---------- Role ---------- */
  const applyRole = async (email, newRole) => {
    setBusyEmail(email);
    try {
      const result = await changeUserRole(email, newRole);
      if (result?.success) {
        toast.success(result.message || "Role updated!");
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: newRole } : u))
        );
        return true;
      }
      toast.error(result?.message || "Failed to change role.");
      return false;
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      return false;
    } finally {
      setBusyEmail(null);
    }
  };

  const handleRoleSelect = (user, newRole) => {
    if (newRole === roleKey(user.role)) return;
    if (newRole === "admin") {
      setRoleTarget({ user, newRole }); // admin বানানো বড় সিদ্ধান্ত, আগে জিজ্ঞেস করা
      return;
    }
    applyRole(user.email, newRole);
  };

  const closeRole = useCallback(() => {
    if (confirming) return;
    setRoleTarget(null);
  }, [confirming]);

  const confirmRole = async () => {
    if (!roleTarget) return;
    setConfirming(true);
    await applyRole(roleTarget.user.email, roleTarget.newRole);
    setConfirming(false);
    setRoleTarget(null);
  };

  /* ---------- Delete ---------- */
  const closeDelete = useCallback(() => {
    if (confirming) return;
    setDeleteTarget(null);
  }, [confirming]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const email = deleteTarget.email;

    setConfirming(true);
    setBusyEmail(email);
    try {
      const result = await deleteUser(email);
      if (result?.success) {
        toast.success(result.message || "User deleted!");
        setUsers((prev) => prev.filter((u) => u.email !== email));
        setDeleteTarget(null);
      } else {
        toast.error(result?.message || "Failed to delete user.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusyEmail(null);
      setConfirming(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
  };

  const DeleteButton = ({ u, fullWidth = false }) => {
    const self = isSelf(u);
    return (
      <button
        type="button"
        onClick={() => setDeleteTarget(u)}
        disabled={busyEmail === u.email || self}
        title={self ? "You can't delete your own account" : undefined}
        className={`${btnSm} ${btnDanger} ${fullWidth ? "w-full" : ""}`}
      >
        <FaTrashCan aria-hidden="true" className="text-[10px]" />
        Delete
      </button>
    );
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
              Manage users
            </h1>
            <div
              aria-hidden="true"
              className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              View accounts, change roles and remove users
            </p>

            {users.length > 0 && (
              <dl className="mt-6 flex flex-wrap gap-3">
                <Stat label="Total" value={users.length} />
                <Stat label="Admins" value={counts.admin} />
                <Stat label="Lawyers" value={counts.lawyer} />
                <Stat label="Users" value={counts.user} />
              </dl>
            )}
          </div>
        </header>

        {users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14213D] text-2xl text-[#E2B93B]">
              <FaUsers aria-hidden="true" />
            </div>
            <h2
              className="mt-6 text-2xl font-bold tracking-[-0.01em] text-[#14213D]"
              style={headingFont}
            >
              No users found
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#475569]">
              When people sign up, they will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* ---------- Toolbar: search + filter ---------- */}
            <div className="flex flex-col gap-3 border-b border-[#DCE3EE] bg-[#F3F6FB] px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <FaMagnifyingGlass
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                />
                <label htmlFor="user-search" className="sr-only">
                  Search users by name or email
                </label>
                <input
                  id="user-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border border-[#DCE3EE] bg-white pl-11 pr-4 text-sm text-[#0B1526] outline-none transition placeholder:text-slate-400 focus:border-[#E2B93B] focus:ring-4 focus:ring-[#E2B93B]/20"
                />
              </div>

              <div
                role="group"
                aria-label="Filter by role"
                className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0"
              >
                {FILTERS.map((f) => {
                  const active = filter === f.key;
                  const count = f.key === "all" ? users.length : counts[f.key];
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
                <h2
                  className="mt-5 text-xl font-bold text-[#14213D]"
                  style={headingFont}
                >
                  No matching users
                </h2>
                <p className="mt-2 text-sm text-[#475569]">
                  Try a different name, email or role.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`${btnSm} ${btnOutline} mt-5`}
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
                      Users with role selector and delete action
                    </caption>
                    <thead>
                      <tr className="border-b border-[#DCE3EE] bg-[#F3F6FB]">
                        <Th>#</Th>
                        <Th>User</Th>
                        <Th>Role</Th>
                        {hasDates && <Th>Joined</Th>}
                        <Th className="text-right">Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((u, i) => {
                        const busy = busyEmail === u.email;
                        const self = isSelf(u);
                        return (
                          <tr
                            key={u.email}
                            className={`border-b border-[#E6ECF5] transition-colors duration-200 hover:bg-[#F8FAFD] motion-reduce:transition-none ${
                              busy ? "opacity-60" : ""
                            }`}
                          >
                            <td className="px-5 py-4 text-sm font-medium text-[#475569]">
                              {String(i + 1).padStart(2, "0")}
                            </td>
                            <td className="px-5 py-4">
                              <UserInfo user={u} isSelf={self} />
                            </td>
                            <td className="w-48 px-5 py-4">
                              <RoleSelect
                                user={u}
                                busy={busy}
                                disabled={busy || self}
                                onChange={handleRoleSelect}
                              />
                            </td>
                            {hasDates && (
                              <td className="px-5 py-4 text-[#14213D]">
                                {formatDate(u.createdAt)}
                              </td>
                            )}
                            <td className="px-5 py-4 text-right">
                              <DeleteButton u={u} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: card list */}
                <ul className="divide-y divide-[#E6ECF5] md:hidden">
                  {visible.map((u, i) => {
                    const busy = busyEmail === u.email;
                    const self = isSelf(u);
                    return (
                      <li
                        key={u.email}
                        className={`space-y-4 px-5 py-5 ${busy ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <UserInfo user={u} isSelf={self} />
                          <span className="shrink-0 text-xs font-medium text-[#475569]">
                            #{String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-4">
                          <div>
                            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#475569]">
                              Role
                            </p>
                            <RoleSelect
                              user={u}
                              busy={busy}
                              disabled={busy || self}
                              onChange={handleRoleSelect}
                            />
                          </div>
                          <div>
                            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#475569]">
                              Joined
                            </p>
                            <p className="flex h-10 items-center text-sm text-[#14213D]">
                              {formatDate(u.createdAt)}
                            </p>
                          </div>
                        </div>

                        <DeleteButton u={u} fullWidth />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            <div className="border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-3 text-xs text-[#475569]">
              Showing {visible.length} of {users.length}{" "}
              {users.length === 1 ? "user" : "users"}
            </div>
          </>
        )}
      </div>

      {/* ---------- Admin বানানোর confirm ---------- */}
      <Modal open={!!roleTarget} onClose={closeRole} titleId="role-title">
        <div className="p-6 text-center sm:p-8">
          <span
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#14213D] text-xl text-[#E2B93B]"
          >
            <FaUserShield />
          </span>
          <h2
            id="role-title"
            className="mt-5 text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
            style={headingFont}
          >
            Make this user an admin?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-[#0B1526]">
              {roleTarget?.user?.name || roleTarget?.user?.email}
            </span>{" "}
            will get full access to manage users, transactions and analytics.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={closeRole}
              disabled={confirming}
              className={`${btnMd} ${btnOutline}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmRole}
              disabled={confirming}
              aria-busy={confirming}
              className={`${btnMd} ${btnGold}`}
            >
              {confirming ? (
                <>
                  <FaSpinner
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                  />
                  Saving...
                </>
              ) : (
                "Yes, make admin"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* ---------- Delete confirm ---------- */}
      <Modal open={!!deleteTarget} onClose={closeDelete} titleId="delete-user-title">
        <div className="p-6 text-center sm:p-8">
          <span
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2] text-xl text-[#B91C1C]"
          >
            <FaTriangleExclamation />
          </span>
          <h2
            id="delete-user-title"
            className="mt-5 text-2xl font-bold tracking-[-0.01em] text-[#0B1526]"
            style={headingFont}
          >
            Delete this user?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            This account will be removed permanently. This cannot be undone.
          </p>

          {deleteTarget && (
            <div className="mt-4 rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] px-4 py-3 text-left">
              <p className="truncate text-sm font-semibold text-[#14213D]">
                {deleteTarget.name || "Unknown"}
              </p>
              <p className="truncate text-xs text-[#475569]">{deleteTarget.email}</p>
            </div>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={closeDelete}
              disabled={confirming}
              className={`${btnMd} ${btnOutline}`}
            >
              Keep user
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={confirming}
              aria-busy={confirming}
              className={`${btnMd} ${btnDangerSolid}`}
            >
              {confirming ? (
                <>
                  <FaSpinner
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                  />
                  Deleting...
                </>
              ) : (
                "Yes, delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}