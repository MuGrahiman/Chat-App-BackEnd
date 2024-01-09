import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userID: { type: String, required:true },
});
export default mongoose.model("user", userSchema);
