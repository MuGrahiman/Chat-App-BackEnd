import mongoose from "mongoose";

const privateSchema = mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		chats: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
		},
		
	},
	{ timestamps: true }
);

export default mongoose.model("Private", privateSchema);
