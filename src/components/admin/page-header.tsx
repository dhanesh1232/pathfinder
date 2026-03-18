"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  badge: string;
  badgeClassName?: string;
  children?: React.ReactNode;
  showSeparator?: boolean;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  badgeClassName,
  children,
  showSeparator = false,
}: AdminPageHeaderProps) {
  useEffect(() => {
    document.title = `${title} | Admin`;
  }, [title]);

  return (
    <div className="space-y-2">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className={cn(
              "px-3 py-1 text-[10px] uppercase tracking-widest font-bold border-none bg-zinc-900/50 text-zinc-400 rounded-md",
              badgeClassName,
            )}
          >
            {badge}
          </Badge>
          <h1 className="text-2xl lg:text-4xl md:text-3xl font-black tracking-tighter text-white italic">
            {title}
          </h1>
          <p className="text-zinc-500 font-medium text-sm">{description}</p>
        </div>

        <div className="flex items-center gap-3">{children}</div>
      </header>

      {showSeparator && <Separator className="bg-pathfinder-green/40 h-px" />}
    </div>
  );
}
