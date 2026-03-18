import mongoose, { Document, Model } from "mongoose";

export interface IOurWork extends Document {
  title: string;
  videoUrl: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ourWorkSchema = new mongoose.Schema<IOurWork>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const OurWork: Model<IOurWork> =
  mongoose.models.OurWork || mongoose.model<IOurWork>("OurWork", ourWorkSchema);

export default OurWork;
