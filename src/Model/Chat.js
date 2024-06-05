import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
	// {
	// 	type: {
	// 		type: String,
	// 		enum: ["Private", "Group", "Channel"],
	// 		required: true,
	// 	},
	// 	recipients: [
	// 		{
	// 			type: mongoose.Schema.Types.ObjectId,
	// 			ref: "User",
	// 		},
	// 	],
	// 	chat: {
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		refPath: "type",
	// 	},
	// },
	{
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
