import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User, { IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();
        const user = await User.findOne({
          email: credentials.email,
        }).lean<IUser>();

        if (!user || !user.password) {
          return null;
        }

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (isMatch) {
          return {
            id: (user as any)._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
});
