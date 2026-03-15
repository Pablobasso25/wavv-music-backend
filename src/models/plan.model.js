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
      required: true,
      min: 0 
    },
    benefits: { 
      type: [String], 
      default: [] 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    adInterval: {
      type: Number,
      default: 3,
      min: 0
    },
    playlistLimit: {
      type: Number,
      default: 5,
      min: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);