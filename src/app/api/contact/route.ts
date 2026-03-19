import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";
import { sendThankYouEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, source, website, service, budget } =
      body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    await connectDB();

    // 1. Create the submission
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

    // 2. Attempt to send the thank you email
    let emailSent = false;
    let emailError = "";

    try {
      await sendThankYouEmail(email, name);
      emailSent = true;
    } catch (error: any) {
      console.error("API Email Error:", error);
      emailError = error.message || "Unknown email error";
    }

    // 3. Update the record with email status
    await ContactSubmission.findByIdAndUpdate(submission._id, {
      emailSent,
      emailError,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent.",
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
