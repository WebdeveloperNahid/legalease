
import { getUserSession } from "@/lib/core/session";
import {
  Bell,
  Envelope,
  House,
  Magnifier,
  Person,
  Receipt,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { FaChartPie } from "react-icons/fa6";
import { VscLayoutSidebarLeft } from "react-icons/vsc";

export async function DashboardSidebar() {
  const user = await getUserSession();

  const clientNavLinks = [
    { icon: House, label: "Home", href: "/dashboard/user" },
    {
      icon: Magnifier,
      label: "Hiring History",
      href: "/dashboard/user/hiring-history",
    },
    {
      icon: Bell,
      label: "Update Profile",
      href: "/dashboard/user/update-profile",
    },
    { icon: Envelope, label: "My Comments", href: "/dashboard/user/comments" },
  ];

  const lawyerNavLinks = [
    { icon: House, label: "Home", href: "/dashboard/lawyer" },
    {
      icon: Magnifier,
      label: "Lawyers Porfile",
      href: "/dashboard/lawyer/manage-legal-profile",
    },
    { icon: Bell, label: "Notifications", href: "dashboard/lawyer" },
    { icon: Envelope, label: "Messages", href: "dashboard/lawyer" },
    { icon: Person, label: "Profile", href: "dashboard/lawyer" },
  ];

  const adminNavLinks = [
    { icon: House, label: "Dashboard", href: "/dashboard/admin" },
    {
      icon: FaChartPie,
      label: "Analytics",
      href: "/dashboard/admin/analytics",
    },
    {
      icon: House,
      label: "Manage Users",
      href: "/dashboard/admin/manage-users",
    },
    {
      icon: Receipt,
      label: "All Transactions",
      href: "/dashboard/admin/all-transactions",
    },
  ];

  const navLinksMap = {
    client: clientNavLinks,
    lawyer: lawyerNavLinks,
    admin:adminNavLinks
  };

  const navItems = navLinksMap[user?.role] || clientNavLinks;

  const navContent = (
    <nav className="flex flex-col gap-1  ">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm  transition-colors hover:bg-sky-500 bg-[#2D2C10] text-[#fffb07] cursor-pointer "
        >
          <item.icon className="size-5  text-[#fffb07]" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        {navContent}
      </aside>
      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <VscLayoutSidebarLeft />
          Sidebar
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading className="text-green-500 bg-green-200 font-bold py-1 px-2 rounded-[7px]">
                  Navigation
                </Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
