import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Support both single item and array of items
    const testimonials = Array.isArray(body) ? body : [body];
    
    // Validate that each item has required fields
    for (const item of testimonials) {
      if (!item.author || !item.text) {
        return NextResponse.json(
          { error: "Validation failed: 'author' and 'text' are required for all items." },
          { status: 400 }
        );
      }
    }

    // Filter out items that already exist based on author and text
    const results = [];
    for (const data of testimonials) {
      const existing = await Testimonial.findOne({ 
        author: data.author, 
        text: data.text 
      });
      
      if (!existing) {
        const created = await Testimonial.create({
          author: data.author,
          text: data.text,
          role: data.role || "",
          order: data.order || 0,
        });
        results.push(created);
      } else {
        results.push({ message: "Item already exists", item: existing });
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      items: results 
    });
  } catch (error: any) {
    console.error("Testimonials API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
