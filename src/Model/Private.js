import mongoose from "mongoose";

const privateSchema = mongoose.Schema(
	{
		chatName: { type: String, required: true },
		permission: {
			isBlocked: { type: Boolean, default: false },
			blockedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			followersOnly: { type: Boolean, default: false },
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Private", privateSchema);
