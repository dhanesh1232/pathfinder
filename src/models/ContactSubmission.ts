import mongoose, { Document, Model } from "mongoose";

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone: string;
  source: string;
  website?: string;
  message: string;
  service?: string;
  budget?: string;
  status: "New" | "In Progress" | "Closed" | "Junk";
  priority: "Low" | "Medium" | "High";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSubmissionSchema = new mongoose.Schema<IContactSubmission>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: false, // Multiple submissions from same email allowed
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Closed", "Junk"],
      default: "New",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    contactSubmissionSchema,
  );

export default ContactSubmission;
