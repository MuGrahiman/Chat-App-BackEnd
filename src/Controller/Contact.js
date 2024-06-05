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

export const getAllUserContacts = async (req, res) => {
	try {
		console.log("req.userId");
		const { userId } = req;
		if (!userId) res.status(400).json({ message: "User not found" });
		const user = new mongoose.Types.ObjectId(userId);

		const contacts = await contactModel
			.findOne({ userId: user })
			.populate(populateOptions);
		console.log(contacts);

		console.log(contacts.chatList[0]);
		const result = destructuringFun(contacts);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "something went wrong" });
	}
};

export const toggleFollowStatus = async (req, res) => {
	try {
		const targetUserId = new mongoose.Types.ObjectId(req.body.id);
		const currentUserId = new mongoose.Types.ObjectId(req.userId);

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
		// helper for update the follow status
		console.log(currentUserContact?.followingList?.includes(targetUserId));
		if (currentUserContact?.followingList?.includes(targetUserId)) {
			const updatedStatus = currentUserContact.followingList.filter(
				(id) => !id.equals(targetUserId)
			);
			currentUserContact.followingList = updatedStatus;
		} else currentUserContact.followingList.push(targetUserId);

		console.log(targetUserContact?.followerList?.includes(currentUserId));
		if (targetUserContact?.followerList?.includes(currentUserId)) {
			const updatedStatus = targetUserContact?.followerList?.filter(
				(id) => !id.equals(currentUserId)
			);
			targetUserContact.followerList = updatedStatus;
		} else targetUserContact.followerList.push(currentUserId);

		await Promise.all([currentUserContact.save(), targetUserContact.save()]);

		await currentUserContact.populate(populateOptions);
		const result = destructuringFun(currentUserContact);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const removeChat = async (req, res) => {
	try {
		const targetUserId = new mongoose.Types.ObjectId(req.body.id);
		const currentUserId = new mongoose.Types.ObjectId(req.userId);

		const [targetUser, currentUser] = await Promise.all([
			userModel.findById(targetUserId),
			userModel.findById(currentUserId),
		]);

		if (!targetUser || !currentUser) {
			return res.status(404).json({ message: "Invalid user ID" });
		}

		// const [targetUserContact, currentUserContact] = await Promise.all([
		// 	contactModel.findOne({ userId: targetUserId }),
		// ]);
		const currentUserContact = await contactModel.findOne({
			userId: currentUserId,
		});
		if (!currentUserContact) {
			return res.status(404).json({ message: "Contact not found" });
		}

		const participantIds = [currentUserId, targetUserId];
		const existPrivateChat = await privateModel.findOne({
			participants: { $all: participantIds },
		});
		if (!existPrivateChat) {
			return res.status(404).json({ message: "Chat not found" });
		}
		console.log(existPrivateChat);
		console.log(currentUserContact.chatList.length);
		console.log(!existPrivateChat[0]);

		if (existPrivateChat) {
			const updatedChatList = currentUserContact.chatList.filter(
				(chat) =>
					chat.type === "Private" && !chat.chat.equals(existPrivateChat._id)
			);

			console.log(
				currentUserContact.chatList.some(
					(chat) =>
						chat.type === "Private" && chat.chat.equals(existPrivateChat._id)
				)
			);

			console.log(updatedChatList.length);
			currentUserContact.chatList = updatedChatList;
		}

		await currentUserContact.save();

		await currentUserContact.populate(populateOptions);
		const result = destructuringFun(currentUserContact);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const createGroup = async (req, res) => {
	try {
		console.log("create group ");
		console.log(req.body);
		const userId = req.userId;
		const groupName = req.body.name;
		const Ids = req.body.ids;
		if (!userId) res.status(400).json({ message: "User not Authorized" });
		if (!groupName || !Ids) res.status(400).json({ message: "Invalid data" });
		const currentUserId = new mongoose.Types.ObjectId(userId);
		const existingData = await userModel.find({ _id: { $in: Ids } });
		console.log(existingData);
		if (!existingData || existingData.length !== Ids.length)
			res.status(404).json({ message: "Users are not valid" });
		const newGroup = await groupModel.create({
			chatName: groupName,
			creator: userId,
			admins: [userId],
			participants: [...Ids, currentUserId],
			// chats,
		});
		const contactsPromises = Ids.map((userId) =>
			contactModel.findOne({ userId })
		);
		const contacts = await Promise.all(contactsPromises);
		console.log(contacts);
		const contactUpdates = contacts.map(async (contact) => {
			const groupExists = contact.chatList.some((chat) =>
				chat.chat.equals(newGroup._id)
			);
			if (!groupExists) {
				contact.chatList.push({ type: "Group", chat: newGroup._id });
				await contact.save();
			}
		});
		await Promise.all(contactUpdates);
		console.log(contactUpdates);

		const userContacts = await contactModel.findOne({ userId: currentUserId });
		userContacts.chatList.push({ type: "Group", chat: newGroup._id });
		await userContacts.save();

		await userContacts.populate(populateOptions);
		const result = destructuringFun(userContacts);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const exitGroup = async (req, res) => {
	try {
		const userId = req.userId;
		const groupId = req.body.id;
		if (!userId)
			return res.status(400).json({ message: "User not Authorized" });
		if (!groupId) return res.status(400).json({ message: "Invalid data" });
		const targetGrpId = new mongoose.Types.ObjectId(req.body.id);
		const currentUserId = new mongoose.Types.ObjectId(req.userId);

		const existGroup = await groupModel.findById(targetGrpId);
		if (!existGroup)
			return res.status(400).json({ message: "Group is not exist" });

		const existContact = await contactModel.findOne({ userId: currentUserId });
		if (!existContact)
			return res.status(400).json({ message: "Contact is not exist" });
		console.log(existGroup);
		console.log(currentUserId);
		// const isCreator = await existGroup.creator.equals(currentUserId);
		const isCreator = existGroup.creator === currentUserId;
		if (isCreator)
			return res.status(400).json({ message: "you cant exit the group" });
		console.log(isCreator);

		await Promise.all([
			existGroup.participants.pull(currentUserId),
			existGroup.save(),
			existContact.chatList.pull({ type: "Group", chat: targetGrpId }),
			existContact.save(),
		]);

		await existContact.populate(populateOptions);
		console.log(existContact);

		const result = destructuringFun(existContact);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: error.message || "Something went wrong" });
	}
};

export const addToGroup = async (req, res) => {
	try {
		const userId = req.userId;
		const groupId = req.body.id;
		if (!userId)
			return res.status(400).json({ message: "User not Authorized" });
		if (!groupId) return res.status(400).json({ message: "Invalid data" });

		const targetGrpId = new mongoose.Types.ObjectId(req.body.id);
		const currentUserId = new mongoose.Types.ObjectId(req.userId);

		const existGroup = await groupModel.findById(targetGrpId);
		if (!existGroup)
			return res.status(400).json({ message: "Group is not exist" });

		const existContact = await contactModel.findOne({ userId: currentUserId });
		if (!existContact)
			return res.status(400).json({ message: "Contact is not exist" });
		console.log(existGroup);
		console.log(currentUserId);
		const isCreator = existGroup.creator === currentUserId;
		if (isCreator)
			return res.status(400).json({ message: "you cant exit the group" });
		console.log(isCreator);

		await Promise.all([
			existGroup.participants.pull(currentUserId),
			existGroup.save(),
			existContact.chatList.pull({ type: "Group", chat: targetGrpId }),
			existContact.save(),
		]);

		await existContact.populate(populateOptions);
		console.log(existContact);

		const result = destructuringFun(existContact);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: error.message || "Something went wrong" });
	}
};

export const createChannel = async (req, res) => {
	try {
		console.log("create channel ");
		console.log(req.body);
		const userId = req.userId;
		const channelName = req.body.name;
		// const Ids = req.body.ids;
		if (!userId) res.status(400).json({ message: "User not Authorized" });
		if (!channelName) res.status(400).json({ message: "Invalid data" });
		const currentUserId = new mongoose.Types.ObjectId(userId);
		// const existingData = await userModel.find({ _id: { $in: Ids } });
		// console.log(existingData);
		// if (!existingData || existingData.length !== Ids.length)
		// 	res.status(404).json({ message: "Users are not valid" });
		const newChannel = await channelModel.create({
			chatName: channelName,
			creator: currentUserId,
			admins: [currentUserId],
		});
		// const contactsPromises = Ids.map((userId) =>
		// 	contactModel.findOne({ userId })
		// );
		// const contacts = await Promise.all(contactsPromises);
		// console.log(contacts);
		// const contactUpdates = contacts.map(async (contact) => {
		// 	const groupExists = contact.chatList.some((chat) =>
		// 		chat.chat.equals(newChannel._id)
		// 	);
		// 	if (!groupExists) {
		// 		contact.chatList.push({ type: "Group", chat: newChannel._id });
		// 		await contact.save();
		// 	}
		// });
		// await Promise.all(contactUpdates);
		// console.log(contactUpdates);

		const userContacts = await contactModel.findOne({ userId: currentUserId });
		userContacts.chatList.push({ type: "Channel", chat: newChannel._id });
		await userContacts.save();
		await userContacts.populate(populateOptions);
		const result = destructuringFun(userContacts);
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const getAllChannels = async (req, res) => {
	console.log("get all channel ");
	console.log(req.body);
	try {
		const groups = await groupModel.find();
		res.status(200).json(groups);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const joinChannel = async (req, res) => {
	console.log("join channel ");
	console.log(req.body);
	try {
		const groups = await groupModel.find();
		res.status(200).json(groups);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

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
	console.log("🚀 ~ createConnection ~ ");
	try {
		const targetUserId = new mongoose.Types.ObjectId(req.params.id);

		console.log("🚀 ~ createConnection ~ targetUserId:", targetUserId);

		const currentUserId = new mongoose.Types.ObjectId(req.userId);

		console.log("🚀 ~ createConnection ~ currentUserId:", currentUserId);

		if (!targetUserId || !currentUserId)
			return res.status(404).json({ message: " user ID Needed" });

		const [targetUser, currentUser] = await Promise.all([
			userModel.findById(targetUserId),
			userModel.findById(currentUserId),
		]);

		if (!targetUser || !currentUser)
			return res.status(404).json({ message: "Invalid user ID" });

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
			chats: newChat._id,
		});

		res.status(200).json({
			chatId: privateChat?._id,
		});
	} catch (error) {
		console.log("🚀 ~ createConnection ~ error:", error);

		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};
