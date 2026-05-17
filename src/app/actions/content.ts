"use server";

import connectDB from "@/lib/db";
import Logo from "@/models/Logo";
import Portfolio from "@/models/Portfolio";
import OurWork from "@/models/OurWork";
import Testimonial from "@/models/Testimonial";
import ContactSubmission from "@/models/ContactSubmission";
import { revalidatePath } from "next/cache";

// --- Logos ---
// Public: active only, newest first
export async function getLogos() {
  await connectDB();
  return JSON.parse(
    JSON.stringify(
      await Logo.find({ isActive: true }).sort({ createdAt: -1 })
    )
  );
}

// Admin: all logos, ordered for management
export async function getAllLogos() {
  await connectDB();
  return JSON.parse(JSON.stringify(await Logo.find().sort({ order: 1 })));
}

export async function upsertLogo(data: any) {
  await connectDB();
  const { id, ...rest } = data;
  if (id) {
    await Logo.findByIdAndUpdate(id, rest);
  } else {
    await Logo.create(rest);
  }
  revalidatePath("/");
  revalidatePath("/admin/logos");
  return { success: true };
}

export async function deleteLogo(id: string) {
  await connectDB();
  await Logo.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/admin/logos");
  return { success: true };
}

// --- Portfolio ---
// Public: active only, newest first
export async function getPortfolioItems() {
  await connectDB();
  return JSON.parse(
    JSON.stringify(
      await Portfolio.find({ isActive: true }).sort({ createdAt: -1 })
    )
  );
}

// Admin: all items, ordered for management
export async function getAllPortfolioItems() {
  await connectDB();
  return JSON.parse(JSON.stringify(await Portfolio.find().sort({ order: 1 })));
}

export async function upsertPortfolio(data: any) {
  await connectDB();
  const { id, ...rest } = data;
  if (id) {
    await Portfolio.findByIdAndUpdate(id, rest);
  } else {
    await Portfolio.create(rest);
  }
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

export async function deletePortfolio(id: string) {
  await connectDB();
  await Portfolio.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true };
}

// --- Our Work (Reels) ---
// Public: active only, newest first
export async function getOurWorkItems() {
  await connectDB();
  return JSON.parse(
    JSON.stringify(
      await OurWork.find({ isActive: true }).sort({ createdAt: -1 })
    )
  );
}

// Admin: all items, ordered for management
export async function getAllOurWorkItems() {
  await connectDB();
  return JSON.parse(JSON.stringify(await OurWork.find().sort({ order: 1 })));
}

export async function upsertOurWork(data: any) {
  await connectDB();
  const { id, ...rest } = data;
  if (id) {
    await OurWork.findByIdAndUpdate(id, rest);
  } else {
    await OurWork.create(rest);
  }
  revalidatePath("/");
  revalidatePath("/admin/our-work");
  return { success: true };
}

export async function deleteOurWork(id: string) {
  await connectDB();
  await OurWork.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/admin/our-work");
  return { success: true };
}

// --- Testimonials ---
// Public: active only, newest first
export async function getTestimonials() {
  await connectDB();
  return JSON.parse(
    JSON.stringify(
      await Testimonial.find({ isActive: true }).sort({ createdAt: -1 })
    )
  );
}

// Admin: all items, ordered for management
export async function getAllTestimonials() {
  await connectDB();
  return JSON.parse(
    JSON.stringify(await Testimonial.find().sort({ order: 1 }))
  );
}

export async function upsertTestimonial(data: any) {
  await connectDB();
  const { id, ...rest } = data;
  if (id) {
    await Testimonial.findByIdAndUpdate(id, rest);
  } else {
    await Testimonial.create(rest);
  }
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await connectDB();
  await Testimonial.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function getDashboardStats() {
  await connectDB();
  const [logos, portfolio, ourWork, testimonials, contacts] = await Promise.all([
    Logo.countDocuments(),
    Portfolio.countDocuments(),
    OurWork.countDocuments(),
    Testimonial.countDocuments(),
    ContactSubmission.countDocuments(),
  ]);

  return {
    logos,
    portfolio,
    ourWork,
    testimonials,
    contacts,
  };
}
