"use client";

import { usePathname } from "next/navigation";
import { Settings2, LayoutDashboard } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;
    const name =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    return { name, href, isLast };
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-poppins admin-panel">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 bg-zinc-950 h-full overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40 px-6 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="-ml-1 h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-zinc-800"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/admin"
                      className="text-zinc-500 hover:text-pathfinder-green flex items-center gap-1 transition-colors"
                    >
                      <LayoutDashboard className="h-3 w-3" />
                      Admin
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.length > 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  {breadcrumbs.slice(1).map((crumb, index) => (
                    <div
                      key={crumb.href}
                      className="flex items-center gap-1.5 sm:gap-2.5"
                    >
                      <BreadcrumbItem>
                        {crumb.isLast ? (
                          <BreadcrumbPage className="text-white font-black tracking-tight italic uppercase text-[10px]">
                            {crumb.name}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={crumb.href}
                            className="text-zinc-500 hover:text-pathfinder-green transition-colors"
                          >
                            {crumb.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!crumb.isLast && <BreadcrumbSeparator />}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-medium text-zinc-500">
                  System Mode
                </span>
                <span className="text-[10px] font-bold text-pathfinder-green uppercase tracking-widest">
                  Production
                </span>
              </div>
              <Separator
                orientation="vertical"
                className="h-8 bg-zinc-800 hidden md:block"
              />
              <button className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:scale-105 active:scale-95">
                <Settings2 className="h-4 w-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 scroll-smooth">
            <div className="max-w-full lg:max-w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
