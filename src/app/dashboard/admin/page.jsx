
import Link from "next/link";
import { BiBarChart, BiReceipt } from "react-icons/bi";
import { BsArrowUpRight } from "react-icons/bs";
import { PiProjectorScreenChartLight } from "react-icons/pi";


const links = [
  {
    href: "/dashboard/admin/manage-users",
    label: "Manage Users",
    description: "View, change roles, and remove accounts.",
    icon: PiProjectorScreenChartLight,
  },
  {
    href: "/dashboard/admin/all-transactions",
    label: "All Transactions",
    description: "Every payment across the platform.",
    icon: BiReceipt,
  },
  {
    href: "/dashboard/admin/analytics",
    label: "Analytics",
    description: "Users, lawyers, hires, and revenue.",
    icon: BiBarChart,
  },
];

const AdminDashboardHome = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-10 font-sans sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[900px]">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-[#AF8752]">
          Dashboard
        </p>
        <h1 className="mb-2 font-[Georgia,_serif] text-[24px] font-extrabold text-[#11100C] sm:text-[28px]">
          Welcome, Admin
        </h1>
        <p className="mb-8 text-[13px] text-[#8a8578]">
          Manage users, review transactions, and track platform growth.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-[20px] border border-[#eee5d3] bg-white p-6 transition hover:border-[#AF8752]/40 hover:shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f8f7f4] text-[#AF8752]">
                <Icon size={18} strokeWidth={2} />
              </div>

              <div className="flex items-start justify-between gap-2">
                <h2 className="text-[15px] font-extrabold text-[#11100C]">
                  {label}
                </h2>
                <BsArrowUpRight
                  size={16}
                  strokeWidth={2.5}
                  className="mt-0.5 shrink-0 text-[#AF8752] opacity-0 transition group-hover:opacity-100"
                />
              </div>

              <p className="mt-1.5 text-[12px] leading-relaxed text-[#8a8578]">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;