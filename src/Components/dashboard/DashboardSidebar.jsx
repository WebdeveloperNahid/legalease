import { getUserSession } from "@/lib/core/session";
import {
  Bell,
  Clock,
  ClockArrowRotateLeft,
  Envelope,
  House,
  Magnifier,
  Person,
  Receipt,
  ScalesBalanced,
} from "@gravity-ui/icons";
import { User } from "@gravity-ui/uikit";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { BiBarChart, BiMessageSquare } from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa6";
import { LuUserRoundPen } from "react-icons/lu";

import { VscLayoutSidebarLeft } from "react-icons/vsc";

export async function DashboardSidebar() {
  const user = await getUserSession();

  const userNavLinks = [
    { icon: House, label: "Home", href: "/dashboard/user" },
    {
      icon: Clock,
      label: "Hiring History",
      href: "/dashboard/user/hiring-history",
    },
    {
      icon: BiMessageSquare,
      label: "Usre Comments",
      href: "/dashboard/user/comments",
    },
    {
      icon: LuUserRoundPen,
      label: "Update Profile",
      href: "/dashboard/user/update-profile",
    },
  ];

 const lawyerNavLinks = [
  { icon: House, label: "Home", href: "/dashboard/lawyer" },
  { 
    icon: ClockArrowRotateLeft, 
    label: "Hiring History", 
    href: "/dashboard/lawyer/hiring-history" 
  },
  { 
    icon: FaClipboardList , 
    label: "Manage-Lawyer-profile", 
    href: "/dashboard/lawyer/manage-legal-profile" 
  },
  
];

  const adminNavLinks = [
   
    
    {
      icon: House,
      label: "Manage Users",
      href: "/dashboard/admin/manage-users",
    },
    {
      icon: ScalesBalanced,
      label: "All Transactions",
      href: "/dashboard/admin/all-transactions",
    },
    {
      icon: Receipt,
      label: "Admin analytics",
      href: "/dashboard/admin/analytics",
    },
  ];

  const navLinksMap = {
    client: userNavLinks,
    lawyer: lawyerNavLinks,
    admin: adminNavLinks,
  };

  const navItems = navLinksMap[user?.role] || userNavLinks;

  const navContent = (
    <nav className="bg-amber-700 flex flex-col gap-1 ">
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
      <aside className="hidden w-40 shrink-0 border-r border-default p-4  bg-amber-700 lg:block">
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
