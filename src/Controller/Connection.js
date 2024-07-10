import mongoose from "mongoose";
import contactModel from "../Model/Contacts.js";
import userModel from "../Model/User.js";
import privateModel from "../Model/Private.js";
import groupModel from "../Model/Group.js";
import channelModel from "../Model/Channel.js";
import messageModel from "../Model/Message.js";
import chatModel from "../Model/Chat.js";

const populateOptions = [
	{
		path: "chatList",
		populate: {
			path: "chat",
			populate: {
				path: "participants",
			},
		},
	},
	{ path: "followingList" },
	{ path: "followerList" },
	{ path: "groupList" },
	{ path: "subscribedList" },
	{ path: "blockedList" },
];

const destructuringFun = (contacts) => ({
	length: contacts.chatList.length,
	chatList: contacts.chatList,
	followingList: contacts.followingList,
	followerList: contacts.followerList,
	groupList: contacts.groupList,
	subscribedList: contacts.subscribedList,
	blockedList: contacts.blockedList,
});

export const checkConnection = async (req, res) => {
	console.log("🚀 ~ checkConnection ~ ");

	try {
		const targetUserId = new mongoose.Types.ObjectId(req.params.id);
		const currentUserId = new mongoose.Types.ObjectId(req.userId);

		const participantIds = [currentUserId, targetUserId];
		const existPrivateChat = await privateModel.findOne({
			participants: { $all: participantIds },
		});

		//?what if is the chat already have but deleted from the contact list
		//# check the chatId if yes or not also already exist in the contact list or not in message.
		console.log("🚀 ~ checkConnection ~ existPrivateChat:", !!existPrivateChat);

		res.status(200).json({
			isConnected: !!existPrivateChat,
			chatId: existPrivateChat?._id,
		});
	} catch (error) {
		console.log("🚀 ~ checkConnection ~ error:", error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const createConnection = async (req, res) => {
	console.log("🚀 ~ createConnection ~ ", req.params.id);
	try {
		if (!req.userId || !req.params.id)
			return res.status(404).json({ message: " user id required" });

		const targetUserId = new mongoose.Types.ObjectId(req.params.id);
		console.log("🚀 ~ createConnection ~ targetUserId:", targetUserId);

		const currentUserId = new mongoose.Types.ObjectId(req.userId);
		console.log("🚀 ~ createConnection ~ currentUserId:", currentUserId);

		const [targetUser, currentUser] = await Promise.all([
			userModel.findById(targetUserId),
			userModel.findById(currentUserId),
		]);

		const [targetUserContact, currentUserContact] = await Promise.all([
			contactModel.findOne({ userId: targetUserId }),
			contactModel.findOne({ userId: currentUserId }),
		]);

		if (!targetUserContact || !currentUserContact)
			return res.status(404).json({ message: "Contact not found" });

		const participantIds = [currentUserId, targetUserId];

		const existPrivateChat = await privateModel.findOne({
			participants: { $all: participantIds },
		});

		console.log(
			"🚀 ~ createConnection ~ existPrivateChat:",
			!!existPrivateChat
		);

		if (!!existPrivateChat)
			return res.status(404).json({ message: "Already have chat" });

		const message = await messageModel.create({
			text: "Hi",
			sender: currentUserId,
			type: "text",
		});

		const newChat = await chatModel.create({
			messages: [message._id],
		});

		const privateChat = await privateModel.create({
			participants: participantIds,
			chat: newChat._id,
		});

		targetUserContact.chatList.push({ type: "Private", chat: privateChat._id });
		currentUserContact.chatList.push({
			type: "Private",
			chat: privateChat._id,
		});

		await Promise.all([targetUserContact.save(), currentUserContact.save()]);

		res.status(200).json({
			chatId: privateChat?._id,
		});
	} catch (error) {
		console.log("🚀 ~ createConnection ~ error:", error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};
