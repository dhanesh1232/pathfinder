import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        if (token.role) session.user.role = token.role;
        if (token.id) session.user.id = token.id;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      // Logic for authorized callback usually handled in middleware directly if not using this
      // But for simple boolean checks:
      // return !!auth?.user;
      return true; // We will handle custom logic in middleware.ts
    },
  },
  pages: {
    signIn: "/auth/secret-admin",
    error: "/auth/secret-admin",
  },
} satisfies NextAuthConfig;
