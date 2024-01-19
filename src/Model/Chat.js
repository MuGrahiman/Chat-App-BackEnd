import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
	userId: { type: mongoose.Types.ObjectId, ref: "User" },
	chats: [{ type: mongoose.Types.ObjectId, ref: "Conversation" }],
});

export default mongoose.model("Chats", chatSchema);
