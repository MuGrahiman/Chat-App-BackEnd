import mongoose from 'mongoose';

const otpSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    otp: { type: Number, required: true },
    expireAt: { type: Date, default: Date.now, expires: 6000 }, // expire after 10 min
  },
  { timestamps: true }
);

const Otp = mongoose.model('Otp', otpSchema);

Otp.collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 600 });

export default Otp; 