import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: {
      status: { type: String, enum: ["free", "premium"], default: "free" },
      mp_preference_id: { type: String },
      startDate: { type: Date },
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
