import mongoose from "mongoose";

const privateSchema = mongoose.Schema(
	{
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
const PrivateModel = mongoose.model("Private", privateSchema);

export default PrivateModel;
