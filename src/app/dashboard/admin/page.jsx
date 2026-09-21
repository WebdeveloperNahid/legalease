import Link from "next/link";
import {
  FaArrowRight,
  FaChartLine,
  FaReceipt,
  FaShieldHalved,
  FaUsersGear,
} from "react-icons/fa6";
import { getUserSession } from "@/lib/core/session";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8 | Border #DCE3EE | Tint #F3F6FB
  সাদা background-এ gold লেখা #8A6A1C
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const links = [
  {
    href: "/dashboard/admin/manage-users",
    label: "Manage Users",
    description: "View, change roles, and remove accounts.",
    cta: "Open users",
    Icon: FaUsersGear,
  },
  {
    href: "/dashboard/admin/all-transactions",
    label: "All Transactions",
    description: "Every payment across the platform.",
    cta: "View payments",
    Icon: FaReceipt,
  },
  {
    href: "/dashboard/admin/analytics",
    label: "Analytics",
    description: "Users, lawyers, hires, and revenue.",
    cta: "See insights",
    Icon: FaChartLine,
  },
];

const AdminDashboardHome = async () => {
  const user = await getUserSession();
  const firstName = user?.name?.trim()?.split(" ")[0] || "Admin";

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)]">
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-6 py-9 sm:px-10 sm:py-11">
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
              className="mt-4 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-5xl"
              style={headingFont}
            >
              Welcome, <span className="text-[#E2B93B]">{firstName}</span>
            </h1>

            <div
              aria-hidden="true"
              className="mt-4 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              Manage users, review transactions, and track platform growth.
            </p>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E2B93B]/50 bg-[#E2B93B]/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F3D98B]">
              <FaShieldHalved aria-hidden="true" />
              Administrator
            </span>
          </div>
        </header>

        {/* ---------- Body ---------- */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Manage platform
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-[#DCE3EE]" />
          </div>

          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {links.map(({ href, label, description, cta, Icon }, i) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#E2B93B] hover:shadow-[0_14px_36px_rgba(11,21,38,0.14)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
                >
                  {/* gold top line, hover-এ পুরোটা ভরে যায় */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.18] bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12] transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
                  />

                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#14213D] text-xl text-[#E2B93B] transition-colors duration-200 group-hover:bg-[#E2B93B] group-hover:text-[#0B1526] motion-reduce:transition-none"
                    >
                      <Icon />
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-sm font-bold text-[#DCE3EE]"
                      style={headingFont}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    className="mt-5 text-xl font-bold tracking-[-0.01em] text-[#0B1526]"
                    style={headingFont}
                  >
                    {label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8A6A1C] transition-colors group-hover:text-[#0B1526]">
                    {cta}
                    <FaArrowRight
                      aria-hidden="true"
                      className="text-xs transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Footer ---------- */}
        <footer className="border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-4 text-center">
          <p className="text-sm italic text-slate-500">
            Justice is the constant and perpetual will to allot to every man his due.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardHome;