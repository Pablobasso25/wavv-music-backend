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
