"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaArrowLeft,
  FaBarsStaggered,
  FaChartColumn,
  FaClipboardList,
  FaClockRotateLeft,
  FaCommentDots,
  FaHouse,
  FaReceipt,
  FaUserPen,
  FaUsers,
  FaXmark,
} from "react-icons/fa6";

/* ---------- Config ---------- */
const NAVBAR_HEIGHT = 72; // Navbar.jsx-এর সাথে একই রাখুন
const TAB_TOP = "42%"; // ছোট screen-এ বাম tab-এর উচ্চতা (উপর থেকে)। লেখা ঢাকলে বদলান

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8
*/

const NAV = {
  user: [
    { icon: FaHouse, label: "Overview", href: "/dashboard/user", exact: true },
    { icon: FaClockRotateLeft, label: "Hiring History", href: "/dashboard/user/hiring-history" },
    { icon: FaCommentDots, label: "My Comments", href: "/dashboard/user/comments" },
    { icon: FaUserPen, label: "Update Profile", href: "/dashboard/user/update-profile" },
  ],
  lawyer: [
    { icon: FaHouse, label: "Overview", href: "/dashboard/lawyer", exact: true },
    { icon: FaClockRotateLeft, label: "Hiring History", href: "/dashboard/lawyer/hiring-history" },
    { icon: FaClipboardList, label: "Manage Legal Profile", href: "/dashboard/lawyer/manage-legal-profile" },
  ],
  admin: [
    { icon: FaUsers, label: "Manage Users", href: "/dashboard/admin/manage-users" },
    { icon: FaReceipt, label: "All Transactions", href: "/dashboard/admin/all-transactions" },
    { icon: FaChartColumn, label: "Analytics", href: "/dashboard/admin/analytics" },
  ],
};
NAV.client = NAV.user;

const ROLE_LABEL = { user: "Client", client: "Client", lawyer: "Lawyer", admin: "Admin" };

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

/* ---------- Avatar ---------- */
function Avatar({ image, name, email }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || email || "U").trim().charAt(0).toUpperCase();

  if (image && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-11 w-11 shrink-0 rounded-full border border-[#E2B93B]/70 object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2B93B]/70 bg-[#E2B93B]/15 text-lg font-bold text-[#F3D98B]"
      style={headingFont}
    >
      {initial}
    </span>
  );
}

/* ---------- Sidebar content (desktop ও mobile drawer, দুই জায়গায় একই) ---------- */
function SidebarContent({
  items,
  isActive,
  onNavigate,
  role,
  name,
  email,
  image,
  closable = false, // drawer-এ ✕ বাটনের জন্য জায়গা রাখে
  stagger = false, // drawer-এ লিংকগুলো একটার পর একটা ভেসে ওঠে
  open = true,
}) {
  return (
    <div className="flex h-full flex-col">
      {/* User card */}
      <div
        className={`flex items-center gap-3 border-b border-white/10 p-5 ${
          closable ? "pr-16" : ""
        }`}
      >
        <Avatar image={image} name={name} email={email} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#FBF6EA]">
            {name || "My Account"}
          </p>
          <span className="mt-1 inline-flex items-center rounded-full border border-[#E2B93B]/40 bg-[#E2B93B]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F3D98B]">
            {ROLE_LABEL[role] || "Client"}
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E8DCC8]/55">
          Menu
        </p>
        <ul className="mt-3 space-y-1">
          {items.map((item, i) => {
            const active = isActive(item);
            return (
              <li
                key={item.href}
                className={
                  stagger
                    ? `transition-all duration-500 ease-out motion-reduce:transition-none ${
                        open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                      }`
                    : undefined
                }
                style={stagger ? { transitionDelay: open ? `${120 + i * 60}ms` : "0ms" } : undefined}
              >
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200 ${focusRing} ${
                    active
                      ? "bg-[#E2B93B]/12 text-[#F3D98B]"
                      : "text-[#E8DCC8]/85 hover:bg-white/5 hover:text-[#FBF6EA]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#E2B93B] transition-opacity duration-200 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <item.icon
                    aria-hidden="true"
                    className={`shrink-0 text-base transition-colors ${
                      active ? "text-[#E2B93B]" : "text-[#E8DCC8]/60 group-hover:text-[#E2B93B]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back to site */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#E8DCC8]/80 transition-colors hover:bg-white/5 hover:text-[#FBF6EA] ${focusRing}`}
        >
          <FaArrowLeft aria-hidden="true" className="text-sm text-[#E8DCC8]/60" />
          Back to website
        </Link>
      </div>
    </div>
  );
}

/* ---------- Main ---------- */
export default function DashboardSidebarClient({ role, name, email, image }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const drawerRef = useRef(null);
  const triggerRef = useRef(null);
  const touchStartX = useRef(null);

  const items = NAV[role] || NAV.user;

  const isActive = (item) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  // পেজ বদলালে drawer বন্ধ
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // প্রথমবার ঢুকলে কিছুক্ষণ ইশারার ঢেউ, তারপর থেমে যায়
  useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Drawer: Escape, focus আটকানো, scroll বন্ধ, বন্ধ হলে tab-এ focus ফেরা
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const trigger = triggerRef.current;
    const focusable = () =>
      drawer ? Array.from(drawer.querySelectorAll("a[href], button:not([disabled])")) : [];

    focusable()[0]?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusable();
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
      trigger?.focus?.();
    };
  }, [open]);

  // বামে সোয়াইপ করলে বন্ধ
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -60) setOpen(false);
  };

  const openDrawer = () => {
    setHint(false);
    setOpen(true);
  };

  return (
    <>
      {/* ---------- Desktop (আগের মতোই) ---------- */}
      <aside
        className="hidden w-64 shrink-0 border-r border-[#E2B93B]/15 bg-[#0B1526] lg:sticky lg:block lg:self-start"
        style={{ top: NAVBAR_HEIGHT, height: `calc(100svh - ${NAVBAR_HEIGHT}px)` }}
      >
        <SidebarContent
          items={items}
          isActive={isActive}
          role={role}
          name={name}
          email={email}
          image={image}
        />
      </aside>

      {/* ---------- Mobile: বাম কিনারার tab ---------- */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openDrawer}
        aria-label="Open dashboard menu"
        aria-expanded={open}
        aria-controls="dashboard-drawer"
        className={`group fixed left-0 z-40 flex h-14 w-11 origin-left items-center justify-center rounded-r-2xl border border-l-0 border-[#E2B93B]/60 bg-gradient-to-b from-[#14213D] to-[#0B1526] text-[#F3D98B] shadow-[0_8px_24px_rgba(11,21,38,0.45)] transition-all duration-300 ease-out active:scale-90 motion-reduce:transition-none lg:hidden ${focusRing} ${
          open ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
        style={{ top: TAB_TOP }}
      >
        {hint && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-r-2xl border border-[#E2B93B]/70 motion-reduce:hidden"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-y-2 right-0 w-[3px] rounded-l-full bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
        />
        <FaBarsStaggered
          aria-hidden="true"
          className="relative text-lg transition-transform duration-300 group-active:scale-90"
        />
      </button>

      {/* ---------- Mobile: drawer ---------- */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          open ? "visible" : "invisible transition-[visibility] delay-300 duration-0"
        }`}
      >
        {/* Backdrop */}
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[#0B1526]/70 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <div
          id="dashboard-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard menu"
          inert={!open}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={`relative h-full w-[300px] max-w-[85vw] overflow-hidden rounded-r-3xl border-r border-[#E2B93B]/40 bg-gradient-to-b from-[#0B1526] via-[#0F1A30] to-[#0B1526] shadow-[0_0_70px_rgba(0,0,0,0.55)] transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* সাজ: উপরে সোনালি রেখা ও glow */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-[#E2B93B]/10 blur-[80px]"
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className={`absolute right-3 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-[#FBF6EA]/20 text-[#FBF6EA] transition-all hover:border-[#E2B93B] hover:text-[#F3D98B] active:scale-90 ${focusRing}`}
          >
            <FaXmark aria-hidden="true" />
          </button>

          <div className="relative h-full pt-1">
            <SidebarContent
              items={items}
              isActive={isActive}
              onNavigate={() => setOpen(false)}
              role={role}
              name={name}
              email={email}
              image={image}
              closable
              stagger
              open={open}
            />
          </div>
        </div>
      </div>
    </>
  );
}