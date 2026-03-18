"use client";

import { useActionState, useState } from "react";
import { register } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons/icons";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 font-sans selection:bg-emerald-500/30">
      {/* Abstract Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-900/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-900/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner ring-1 ring-white/5"
            >
              <Icons.userPlus className="h-8 w-8" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Create Admin Account
            </h1>
            <p className="text-sm text-zinc-400">
              Register a new administrator for Pathfinders
            </p>
          </div>

          <form action={action} className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wider text-zinc-500"
              >
                Full Name
              </Label>
              <div className="relative group">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-11 border-zinc-800 bg-black/40 pl-4 text-zinc-300 transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-zinc-500"
              >
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@pathfinders.com"
                  required
                  className="h-11 border-zinc-800 bg-black/40 pl-4 text-zinc-300 transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wider text-zinc-500"
              >
                Password
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  title="Must be at least 8 characters"
                  minLength={8}
                  className="h-11 border-zinc-800 bg-black/40 pl-4 pr-10 text-zinc-300 transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <Icons.eyeOff className="h-4 w-4" />
                  ) : (
                    <Icons.eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {state?.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-medium text-red-400 ring-1 ring-red-500/20"
              >
                {state.error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
              disabled={isPending}
            >
              {isPending && (
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isPending ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <span className="text-center w-full flex justify-center mt-4">
            <Link href="/auth/secret-admin" className="hover:text-emerald-500">
              Login
            </Link>
          </span>

          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-zinc-600">
            <Icons.lock className="h-3 w-3" />
            <span>Secure Admin Registration</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
