import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
	userId: { type: mongoose.Types.ObjectId, ref: "User", unique: true },
	chatList: [
		// {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: 'Chat'
		// },
		{
			_id: false,
			type: {
				type: String,
				enum: ["Private", "Group"],
				required: true,
			},
			chat: {
				type: mongoose.Schema.Types.ObjectId,
				ref: function () {
					return this.type;
				},
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
