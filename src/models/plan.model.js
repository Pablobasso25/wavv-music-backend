import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    benefits: { 
      type: [String], 
      default: [] 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);