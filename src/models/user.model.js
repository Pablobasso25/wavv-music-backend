import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: {
      status: { type: String, enum: ["free", "premium", "admin"], default: "free" },
      mp_preference_id: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      warningEmailSent: { type: Boolean, default: false },
      adInterval: { type: Number, default: 3 },
      playlistLimit: { type: Number, default: 5 },
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
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);