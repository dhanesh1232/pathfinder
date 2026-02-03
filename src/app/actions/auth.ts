"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { error: "Missing required fields." };
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "User already exists with this email." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration." };
  }
  redirect("/auth/auth/secret-admin");
}

export async function login(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    await signIn("credentials", {
      ...data,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Access Denied." };
        default:
          return { error: "Something went wrong." };
      }
    }
    // NextAuth throws a Redirect error on success, we need to rethrow it
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
