import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
	{
		type: String,//video , audio , text
		text: { type: String, required: true },
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Message", messageSchema);
