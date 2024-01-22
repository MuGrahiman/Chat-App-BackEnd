import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
	userId: { type: mongoose.Types.ObjectId, ref: "User", unique: true },
	contactList: [{ type: mongoose.Types.ObjectId, ref: "Chat" }],
});

export default mongoose.model("Contact", contactSchema);
