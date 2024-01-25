import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
	userId: { type: mongoose.Types.ObjectId, ref: "User", unique: true },
	chatList: [
		{
			_id: false,
			type: {
				type: String,
				enum: ["private", "group"],
				required: true,
			},
			chat: {
				type: mongoose.Schema.Types.ObjectId,
				refPath: "chatList.$.type",
			},
		},
	],
	followings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

export default mongoose.model("Contact", contactSchema);
