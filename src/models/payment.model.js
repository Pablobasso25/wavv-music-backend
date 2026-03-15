import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentId: { type: String, required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  paymentDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);