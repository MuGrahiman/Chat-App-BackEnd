import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		admins: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

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

export default mongoose.model("Group", groupSchema);
