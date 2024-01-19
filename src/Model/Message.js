import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
	{
		text: { type: String, required: true },
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		type: String,//video , audio , text
	},
	{ timestamps: true }
);

export default mongoose.model("Conversation", messageSchema);
