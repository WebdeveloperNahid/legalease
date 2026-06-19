// import type {ComponentType, SVGProps} from "react";

import {
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { VscLayoutSidebarLeft } from "react-icons/vsc";

export function DashboardSidebar() {
  const navItems = [
    { icon: House, label: "Home" },
    { icon: Magnifier, label: "Search" },
    { icon: Bell, label: "Notifications" },
    { icon: Envelope, label: "Messages" },
    { icon: Person, label: "Profile" },
    { icon: Gear, label: "Settings" },
  ];

  const navContent = (
    <nav className="flex flex-col gap-1  ">
      {navItems.map((item) => (
        <button
          key={item.label}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm  transition-colors hover:bg-sky-500 bg-[#2D2C10] text-[#fffb07] cursor-pointer "
          type="button"
        >
          <item.icon className="size-5  text-[#fffb07]"  />
          {item.label}
        </button>
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
        <Drawer.Backdrop >
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading className="text-green-500 bg-green-200 font-bold py-1 px-2 rounded-[7px]">Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body >{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
