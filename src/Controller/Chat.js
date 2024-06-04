import mongoose from "mongoose";
import messageModel from "../Model/Message.js";
import privateModel from "../Model/Private.js";
import userModel from "../Model/User.js";
import contactModel from "../Model/Contacts.js";
import groupModel from "../Model/Group.js";
import chatTypeDetector from "../Utilities/chatUtils.js";

// checking chat type
export const checkChatType = async (req, res) => {
	try {
		const { chatId } = req.params;

		console.log("🚀 ~ getChatDtl ~ chatId:", chatId);
		if (!chatId) return res.status(400).json({ Message: `require chatId` });

		const isValid = await mongoose.Types.ObjectId.isValid(chatId);
		console.log("🚀 ~ getChatDtl ~ isValid:", isValid);
		if (!isValid) return res.status(400).json({ Message: `invalid chatId` });

		const chatType = await chatTypeDetector(chatId);
		console.log("🚀 ~ getChatDtl ~ chatType:", chatType);

		res.redirect(`/${chatType}/${chatId}`, req.method.toLowerCase());
	} catch (error) {
		console.log("🚀 ~ getChatDtl ~ error:", error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const getAllMessages = async (req, res) => {
	try {
		console.log(`get all message of ${req.params.id}`);
		const chatId = req.params.id;
		const userId = req.userId;
		const targetUserId = new mongoose.Types.ObjectId(req.params.id);
		const currentUserId = new mongoose.Types.ObjectId(req.userId);

		// const msgType = req.body.msgType; //private / group
		// const chatType = req.body.chatType;
		// need an helper for handle group and private.

		console.log(`All Messages form chat '${chatId}' by ${userId}`);
		if (!chatId || !userId)
			return res.status(400).json({ Message: `invalid data` });

		const participantIds = [currentUserId, targetUserId];
		const existPrivateChat = await privateModel.findOne({
			participants: { $all: participantIds },
		});

		// console.log(existChat);
		// if (!existChat)
		// 	return res.status(404).json({ message: "Chat is not Valid" });

		const populateOptions = [
			{ path: "participants" },
			{
				path: "messages",
				populate: {
					path: "sender",
					select: "userName",
				},
			},
		];
		const populatedData =
			existPrivateChat && (await existPrivateChat.populate(populateOptions));

		console.log("🚀 ~ getAllMessages ~ populatedData:", populatedData);

		res
			.status(200)
			.json({ messages: populatedData ? populatedData.messages : null });
			
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const postMessages = async (req, res) => {
	//@description here got userId and chatId as opponent userId
	//# check the chatId if yes or not also already exist in the contact list or not in message.

	console.log(req.body);
	const Text = req.body.text;
	const targetId = req.params.id;
	const userId = req.userId;
	// const msgType = req.body.msgType;
	// const chatType = req.body.chatType;
	// need an helper for handle group and private.
	console.log(`you have an Message:'${Text}' by ${targetId}`);
	try {
		if (!targetId || !Text || !userId)
			return res.status(400).json({ Message: `invalid data` });

		const targetUserId = new mongoose.Types.ObjectId(targetId);
		const currentUserId = new mongoose.Types.ObjectId(userId);

		const [targetUser, currentUser] = await Promise.all([
			userModel.findById(targetUserId),
			userModel.findById(currentUserId),
		]);

		if (!targetUser || !currentUser) {
			return res.status(404).json({ message: "Invalid user ID" });
		}

		const [targetUserContact, currentUserContact] = await Promise.all([
			contactModel.findOne({ userId: targetUserId }),
			contactModel.findOne({ userId: currentUserId }),
		]);

		if (!targetUserContact || !currentUserContact) {
			return res.status(404).json({ message: "Contact not found" });
		}

		const message = await messageModel.create({
			text: Text,
			sender: currentUserId,
			type: "text",
		});

		const participantIds = [currentUserId, targetUserId];
		const existPrivateChat = await privateModel.findOne({
			participants: { $all: participantIds },
		});

		// console.log('existPrivateChat');
		// console.log(existPrivateChat);
		let existChat;
		console.log(!existPrivateChat);
		if (!existPrivateChat) {
			const privateChat = await privateModel.create({
				participants: participantIds,
				messages: message._id,
			});

			currentUserContact.chatList.push({
				type: "Private",
				chat: privateChat._id,
			});
			targetUserContact.chatList.push({
				type: "Private",
				chat: privateChat._id,
			});

			await Promise.all([currentUserContact.save(), targetUserContact.save()]);
			existChat = privateChat;
		} else {
			existPrivateChat.messages.push(message._id);
			existChat = await existPrivateChat.save();
		}
		const isChatIncluded = currentUserContact.chatList.some(
			(chat) => chat.type === "Private" && chat.chat.equals(existChat._id)
		);
		console.log(isChatIncluded);
		if (!isChatIncluded) {
			currentUserContact.chatList.push({
				type: "Private",
				chat: existChat._id,
			});
			await currentUserContact.save();
		}
		// console.log(existChat);
		const populateOptions = [
			{ path: "participants" },
			{
				path: "messages",
				populate: {
					path: "sender",
					select: "userName",
				},
			},
		];
		const populatedData = await existChat.populate(populateOptions);
		// console.log(populatedData);
		res.status(200).json({ messages: populatedData.messages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const getAllGrpMessages = async (req, res) => {
	try {
		console.log(`get all message of ${req.params.id}`);
		const chatId = req.params.id;
		const userId = req.userId;
		const targetChatId = new mongoose.Types.ObjectId(req.params.id);
		// const currentUserId = new mongoose.Types.ObjectId(req.userId);

		// const msgType = req.body.msgType; //private / group
		// const chatType = req.body.chatType;
		// need an helper for handle group and private.

		console.log(`All Messages form chat '${chatId}' by ${userId}`);
		if (!chatId || !userId)
			return res.status(400).json({ Message: `invalid data` });

		// const participantIds = [currentUserId, targetUserId];
		const existChat = await groupModel.findById(targetChatId);

		console.log(existChat);
		if (!existChat)
			return res.status(404).json({ message: "Chat is not Valid" });

		const populateOptions = [
			{ path: "creator" },
			{ path: "admins" },
			{ path: "participants" },
			{
				path: "messages",
				populate: {
					path: "sender",
					select: "userName",
				},
			},
		];
		const populatedData =
			existChat && (await existChat.populate(populateOptions));
		console.log(populatedData);
		res
			.status(200)
			.json({ messages: populatedData ? populatedData.messages : null });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const postGrpMessages = async (req, res) => {
	//@description here got userId and chatId as opponent userId
	console.log(req.params);
	const Text = req.body.text;
	const chatId = req.params.id;
	const userId = req.userId;
	// const msgType = req.body.msgType;
	// const chatType = req.body.chatType;
	// need an helper for handle group and private.
	console.log(`you have an Message:'${Text}' by ${chatId}`);
	try {
		if (!chatId || !Text || !userId)
			return res.status(400).json({ Message: `invalid data` });

		const targetChatId = new mongoose.Types.ObjectId(chatId);
		const currentUserId = new mongoose.Types.ObjectId(userId);

		// const [targetChat, currentUser] = await Promise.all([
		// 	groupModel.findById(targetChatId),
		// 	userModel.findById(currentUserId),
		// ]);

		// if (!targetChat || !currentUser) {
		// 	return res.status(404).json({ message: "Invalid user ID" });
		// }

		// const [targetChatContact, currentUserContact] = await Promise.all([
		// 	contactModel.findOne({ userId: targetChatId }),
		// 	contactModel.findOne({ userId: currentUserId }),
		// ]);

		// if (!targetChatContact || !currentUserContact) {
		// 	return res.status(404).json({ message: "Contact not found" });
		// }
		const existChat = await groupModel.findById(targetChatId);
		if (!existChat) {
			return res.status(404).json({ message: "Invalid user ID" });
		}
		const message = await messageModel.create({
			text: Text,
			sender: currentUserId,
			type: "text",
		});

		// const participantIds = [currentUserId, targetChatId];

		// console.log('existPrivateChat');
		// console.log(existPrivateChat);
		// let existChat;
		// console.log(!existPrivateChat);
		// if (!existPrivateChat) {
		// 	const privateChat = await privateModel.create({
		// 		participants: participantIds,
		// 		messages: message._id,
		// 	});
		// 	currentUserContact.chatList.push({
		// 		type: "Private",
		// 		chat: privateChat._id,
		// 	});
		// 	targetChatContact.chatList.push({
		// 		type: "Private",
		// 		chat: privateChat._id,
		// 	});
		// 	await Promise.all([currentUserContact.save(), targetChatContact.save()]);
		// 	existChat = privateChat;
		// } else {
		existChat.messages.push(message._id);
		await existChat.save();
		// }
		// res.status(200).json({
		// 	contacts: currentUserContact.chatList,
		// 	followings: currentUserContact.followings,
		// 	followers: currentUserContact.followers,
		// });

		// const existChat = await privateModel.findById(chatId);

		// if (!existChat)
		// 	return res.status(404).json({ message: "Chat is not Valid" });
		console.log(existChat);
		const populateOptions = [
			{ path: "creator" },
			{ path: "admins" },
			{ path: "participants" },
			{
				path: "messages",
				populate: {
					path: "sender",
					select: "userName",
				},
			},
		];
		const populatedData = await existChat.populate(populateOptions);
		console.log(populatedData);
		res.status(200).json({ messages: populatedData.messages });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};
