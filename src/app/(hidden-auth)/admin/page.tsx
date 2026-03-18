"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Building2,
  ImageIcon,
  Video,
  MessageSquare,
  Users,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/app/actions/content";
import { AdminPageHeader } from "@/components/admin/page-header";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    logos: 0,
    portfolio: 0,
    ourWork: 0,
    testimonials: 0,
    contacts: 0,
  });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  useEffect(() => {
    document.title = "Dashboard | Admin | Pathfinder";
  }, []);

  const statCards = [
    {
      name: "Partners",
      value: stats.logos,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Portfolio",
      value: stats.portfolio,
      icon: ImageIcon,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      name: "Reels",
      value: stats.ourWork,
      icon: Video,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      name: "Inquiries",
      value: stats.contacts,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <AdminPageHeader
        title="Command Center"
        description={`Active status for ${session?.user?.name?.split(" ")[0] || "Admin"}. All systems operational.`}
        badge="Analytics"
        badgeClassName="border-pathfinder-green/20 text-pathfinder-green bg-pathfinder-green/5"
        showSeparator={true}
      >
        <Button
          asChild
          size="sm"
          variant="polygon"
          className="px-8 group h-9"
        >
          <Link
            href="/admin/contacts"
            className="flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            New Lead
            <Sparkles className="h-3 w-3 group-hover:rotate-12 transition-transform" />
          </Link>
        </Button>
      </AdminPageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm hover:border-pathfinder-green/30 transition-all duration-300 group relative overflow-hidden rounded-lg h-full shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {stat.name}
                </CardTitle>
                <div className={`p-1.5 rounded-md ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 uppercase tracking-tighter">
                    <TrendingUp className="h-2.5 w-2.5" />
                    Live
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1 italic">
            Management Protocol
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Portfolio Showcase",
                desc: "Update regional gallery",
                href: "/admin/portfolio",
                icon: ImageIcon,
                color: "group-hover:text-purple-500",
              },
              {
                title: "Lead Intelligence",
                desc: "Handle new transmissions",
                href: "/admin/contacts",
                icon: Users,
                color: "group-hover:text-emerald-500",
              },
              {
                title: "Success Stories",
                desc: "Client validation logs",
                href: "/admin/testimonials",
                icon: MessageSquare,
                color: "group-hover:text-pink-500",
              },
              {
                title: "Strategic Partners",
                desc: "Verified brand assets",
                href: "/admin/logos",
                icon: Building2,
                color: "group-hover:text-blue-500",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group relative h-full"
              >
                <Card className="h-full bg-zinc-900/20 border-zinc-800/80 hover:bg-zinc-800/30 hover:border-pathfinder-green/20 transition-all duration-300 rounded-lg overflow-hidden shadow-none">
                  <CardContent className="p-5 flex items-start justify-between h-full">
                    <div className="space-y-3">
                      <div
                        className={`w-10 h-10 rounded-md bg-zinc-800/50 flex items-center justify-center transition-colors ${action.color}`}
                      >
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white uppercase tracking-tight italic">
                          {action.title}
                        </h3>
                        <p className="text-zinc-500 text-[10px] font-medium leading-tight uppercase tracking-tighter">
                          {action.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
