"use server";

import connectDB from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";
import { sendThankYouEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const source = formData.get("source") as string;
    const website = formData.get("website") as string;
    const message = formData.get("message") as string;
    const service = formData.get("service") as string;
    const budget = formData.get("budget") as string;

    if (!name || !email || !phone || !message) {
      return { error: "Missing required fields." };
    }

    await connectDB();

    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      source,
      website,
      message,
      service,
      budget,
    });

    // Send thank you email asynchronously
    sendThankYouEmail(email, name);

    revalidatePath("/admin/contacts");

    return { success: true, message: "Thank you! Your message has been sent." };
  } catch (error) {
    console.error("Contact form error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}

export async function getContactSubmissions() {
  try {
    await connectDB();
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
}

export async function markAsRead(id: string) {
  try {
    await connectDB();
    await ContactSubmission.findByIdAndUpdate(id, { isRead: true });
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark as read." };
  }
}

export async function deleteSubmission(id: string) {
  try {
    await connectDB();
    await ContactSubmission.findByIdAndDelete(id);
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete submission." };
  }
}

export async function updateSubmissionStatus(id: string, status: string) {
  try {
    await connectDB();
    await ContactSubmission.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status." };
  }
}

export async function updateSubmissionPriority(id: string, priority: string) {
  try {
    await connectDB();
    await ContactSubmission.findByIdAndUpdate(id, { priority });
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update priority." };
  }
}

export async function createManualLead(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
  website?: string;
  service?: string;
  budget?: string;
  status: string;
  priority: string;
}) {
  try {
    await connectDB();
    const submission = await ContactSubmission.create({
      ...data,
      isRead: true, // Admin-created leads are automatically marked as read
    });
    revalidatePath("/admin/contacts");
    return { success: true, id: submission._id.toString() };
  } catch (error) {
    console.error("Error creating manual lead:", error);
    return { error: "Failed to create lead." };
  }
}
