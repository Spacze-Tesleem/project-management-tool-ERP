"use client";

import * as React from "react";
import {
  LayoutDashboard,
   Calendar,
   FolderIcon,
  Frame,
  Map,
  PieChart,
  UsersIcon,
  Settings2,
} from "lucide-react";

import { Navbar } from "./navbar";
import { Projects } from "./Project";
import { Profile } from "./profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

// Change from tuple to array
const adminList = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Projects",
    url: "#",
    icon: FolderIcon,
    isActive: true,
  },
  {
    name: "Calendar",
    href: "/dashboard/admin/calendar",
    icon: Calendar,
    isActive: true,
  },
  {
    title: "Team",
    url: "#",
    icon: UsersIcon,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
  },
];

// Use title for staffList for consistency
const staffList = [
  {
    title: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    title: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    title: "Travel",
    url: "#",
    icon: Map,
  },
];

export function ErpSidebar({ user, role, ...props }) {
  const navItems = role === "admin" ? adminList : staffList;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <Navbar items={navItems} />
        {/* Only render Projects if you have data.projects, otherwise remove or add fallback */}
        {role === "admin" && <Projects projects={[]} />}
      </SidebarContent>
      <SidebarFooter>
        <Profile user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
