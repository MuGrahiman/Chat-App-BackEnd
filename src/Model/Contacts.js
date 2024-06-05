import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
	userId: { type: mongoose.Types.ObjectId, ref: "User", unique: true },
	chatList: [
		{
			_id: false,
			type: {
				type: String,
				enum: ["Private", "Group", "Channel"],
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
	followingList: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	followerList: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	groupList: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Group",
		},
	],
	subscribedList: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Channel",
		},
	],
	blockedList: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

export default mongoose.model("Contact", contactSchema);
