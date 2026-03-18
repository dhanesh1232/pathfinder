import mongoose, { Document, Model } from "mongoose";

export interface ILogo extends Document {
  name: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const logoSchema = new mongoose.Schema<ILogo>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
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

const Logo: Model<ILogo> =
  mongoose.models.Logo || mongoose.model<ILogo>("Logo", logoSchema);

export default Logo;
