import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["Private", "Group"],
			required: true,
		},
		recipients: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "type",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
