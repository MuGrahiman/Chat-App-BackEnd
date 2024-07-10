import mongoose from "mongoose";

const chatSchema = mongoose.Schema(

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
