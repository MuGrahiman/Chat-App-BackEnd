import mongoose from "mongoose";

const privateSchema = mongoose.Schema(
	{
		// name: { type: String, required: true },
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
