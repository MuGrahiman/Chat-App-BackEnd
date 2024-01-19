import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["private", "group"],
			required: true,
		},
		recipients: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		conversation: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "type",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
