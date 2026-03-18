"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Users,
  Building2,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { logout } from "@/app/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Logos", href: "/admin/logos", icon: Building2 },
  { name: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
  { name: "Our Work", href: "/admin/our-work", icon: Video },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Contacts", href: "/admin/contacts", icon: Users },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userInitial =
    session?.user?.name?.[0] || session?.user?.email?.[0] || "A";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-800 bg-zinc-950"
      {...props}
    >
      <SidebarHeader className="p-1 px-0">
        {state === "collapsed" ? (
          <div className="flex items-center gap-2">
            <Image
              src="/logo/logo.png"
              alt="Logo"
              className="object-contain"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              className="object-contain"
              width={150}
              height={150}
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.name}
                  className={`rounded-md px-4 transition-all duration-200 ${
                    isActive
                      ? "bg-pathfinder-green text-white hover:bg-pathfinder-green/90 font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Link href={item.href}>
                    <item.icon
                      className={`size-4 ${isActive ? "text-white" : "text-zinc-500"}`}
                    />
                    {state === "expanded" && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-zinc-900/50 border border-zinc-800 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent">
            <Avatar className="h-8 w-8 border border-zinc-800">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-pathfinder-green/10 text-pathfinder-green text-xs font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold text-white truncate">
                {session?.user?.name || "Admin"}
              </span>
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                {session?.user?.role}
              </span>
            </div>
          </div>

          <form action={logout}>
            <SidebarMenuButton className="w-full justify-start gap-4 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-md px-4 group-data-[collapsible=icon]:px-2">
              <LogOut className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                Sign Out
              </span>
            </SidebarMenuButton>
          </form>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
