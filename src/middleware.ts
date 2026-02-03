import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");

  // PROTECT ADMIN ROUTES
  if (isAdminRoute) {
    if (!isAuthenticated) {
      // If not authenticated, HIDE the page by rewriting to a 404
      // This makes it look like the page doesn't exist
      return NextResponse.rewrite(new URL("/404", nextUrl));
    }
    // If authenticated, allow access
    return NextResponse.next();
  }

  // ALLOW AUTH ROUTES (Login/Register)
  if (isAuthRoute) {
    if (isAuthenticated) {
      // If already logged in, redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
