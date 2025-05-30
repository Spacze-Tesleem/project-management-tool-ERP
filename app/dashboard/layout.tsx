"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ErpSidebar } from "../component/sidebar";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "staff" | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    if (pathname.includes("/admin")) {
      setRole("admin");
    } else if (pathname.includes("/staff")) {
      setRole("staff");
    }
  }, [pathname]);

  // Fetch user profile from API
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        setUser(null);
      }
    }
    fetchProfile();
  }, []);

  if (!role || !user) return null;

  return (
    <SidebarProvider>
      <ErpSidebar user={user} role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
