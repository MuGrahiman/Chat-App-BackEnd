import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userID: { type: String, unique: true, required: true },
  password: { type: String, minlength: 8, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNo: { type: Number, unique: true, required: true },
  emailId: { type: String, unique: true, required: true },
});
export default mongoose.model("user", userSchema);
