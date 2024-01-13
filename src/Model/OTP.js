import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    otp: { type: Number, required: true, expires: 600 },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
