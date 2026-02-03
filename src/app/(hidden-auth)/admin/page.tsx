"use client";

import { useSession, signOut } from "next-auth/react";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { logout } from "@/app/actions/auth";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <header className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-zinc-400">
              {session?.user?.email}
            </span>
          </div>
          <form action={logout}>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <Icons.lock className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-zinc-400">
            Manage registered admins and team members.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
          <h3 className="text-lg font-semibold mb-2">Content</h3>
          <p className="text-zinc-400">
            Edit website content and portfolio items.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p className="text-zinc-400">System configuration and preferences.</p>
        </div>
      </motion.div>
    </div>
  );
}
