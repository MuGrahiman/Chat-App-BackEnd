import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
	{
		profilePic: {
			type: String,
			default:
				"https://w7.pngwing.com/pngs/522/207/png-transparent-profile-icon-computer-icons-business-management-social-media-service-people-icon-blue-company-people-thumbnail.png",
		},
		chatName: { type: String, required: true },
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		admins: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],

		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],

		chats: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Group", groupSchema);
