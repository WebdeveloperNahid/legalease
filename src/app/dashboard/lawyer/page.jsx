import Link from "next/link";
import { FaArrowRight, FaCircleCheck, FaInbox, FaUserPen } from "react-icons/fa6";
import { getUserSession } from "@/lib/core/session";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Border #DCE3EE | Tint #F3F6FB
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#E2B93B] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const actions = [
  {
    href: "/dashboard/lawyer/profile",
    title: "Manage legal profile",
    desc: "Create or update your public listing.",
    Icon: FaUserPen,
  },
  {
    href: "/dashboard/lawyer/hiring-history",
    title: "Hiring requests",
    desc: "Review and respond to client requests.",
    Icon: FaInbox,
  },
];

const LawyerDashboardHomePage = async () => {
  const user = await getUserSession();

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)]">
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] to-[#14213D] px-6 py-8 sm:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-56 w-80 rounded-full bg-[#E2B93B]/10 blur-[90px]"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
              Lawyer dashboard
            </p>
            <h1
              className="mt-3 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl"
              style={headingFont}
            >
              Welcome back, <span className="text-[#E2B93B]">{user?.name}</span>
            </h1>
            <div
              aria-hidden="true"
              className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
              Your publishing fee is paid and your account is active.
            </p>
          </div>
        </header>

        {/* ---------- Body ---------- */}
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-3">
          {/* Account status */}
          <section className="rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-5 md:col-span-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Account status
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <FaCircleCheck aria-hidden="true" className="text-[#15803D]" />
              <span className="font-semibold text-[#0B1526]">Publishing active</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              You can list your profile and receive client requests.
            </p>
          </section>

          {/* Quick actions */}
          <section className="md:col-span-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Quick actions
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {actions.map(({ href, title, desc, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`group flex h-full flex-col rounded-xl border border-[#DCE3EE] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E2B93B] hover:shadow-[0_10px_28px_rgba(11,21,38,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14213D] text-[#E2B93B]"
                    >
                      <Icon />
                    </span>
                    <span
                      className="mt-4 text-lg font-bold text-[#0B1526]"
                      style={headingFont}
                    >
                      {title}
                    </span>
                    <span className="mt-1 text-sm text-slate-600">{desc}</span>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8A6A1C]">
                      Open
                      <FaArrowRight
                        aria-hidden="true"
                        className="text-xs transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-4 text-center">
          <p className="text-sm italic text-slate-500">
            Justice is the constant and perpetual will to allot to every man his due.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LawyerDashboardHomePage;