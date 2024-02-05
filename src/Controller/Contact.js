import mongoose from "mongoose";
import contactModel from "../Model/Contacts.js";
import userModel from "../Model/User.js";
import privateModel from "../Model/Private.js";
import groupModel from "../Model/Group.js";
import chatModel from "../Model/Chat.js";

export const getAllUserContacts = async (req, res) => {
	try {
		console.log("req.userId");
		const { userId } = req;
		if (!userId) res.status(400).json({ message: "User not found" });
		const user = new mongoose.Types.ObjectId(userId);
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
			{ path: "followings" },
			{ path: "followers" },
		];

		const contacts = await contactModel
			.findOne({ userId: user })
			.populate(populateOptions);
		console.log(contacts);

		console.log(contacts.chatList[0]);
		res.status(200).json({
			contacts: contacts.chatList,
			followings: contacts.followings,
			followers: contacts.followers,
		});
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
		console.log(currentUserContact.followings.includes(targetUserId));
		if (currentUserContact.followings.includes(targetUserId)) {
			const updatedStatus = currentUserContact.followings.filter(
				(id) => !id.equals(targetUserId)
			);
			currentUserContact.followings = updatedStatus;
		} else currentUserContact.followings.push(targetUserId);

		console.log(targetUserContact.followers.includes(currentUserId));
		if (targetUserContact.followers.includes(currentUserId)) {
			const updatedStatus = targetUserContact.followers.filter(
				(id) => !id.equals(currentUserId)
			);
			targetUserContact.followers = updatedStatus;
		} else targetUserContact.followers.push(currentUserId);

		const participantIds = [currentUserId, targetUserId];
		const existPrivateChat = await privateModel.find({
			participants: { $all: participantIds },
		});
		console.log(!existPrivateChat[0]);
		if (!existPrivateChat[0]) {
			const privateChat = await privateModel.create({
				participants: participantIds,
			});
			currentUserContact.chatList.push({
				type: "Private",
				chat: privateChat._id,
			});
			targetUserContact.chatList.push({
				type: "Private",
				chat: privateChat._id,
			});
		}
		console.log(currentUserContact);
		await Promise.all([currentUserContact.save(), targetUserContact.save()]);
		res.status(200).json({
			contacts: currentUserContact.chatList,
			followings: currentUserContact.followings,
			followers: currentUserContact.followers,
		});
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
			{ path: "followings" },
			{ path: "followers" },
		];

		const userContacts = await contactModel.findOne({ userId: currentUserId });
		userContacts.chatList.push({ type: "Group", chat: newGroup._id });
		await userContacts.save();
		await userContacts.populate(populateOptions);
		res.status(200).json({
			contacts: userContacts.chatList,
			followings: userContacts.followings,
			followers: userContacts.followers,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};

export const exitGroup = async (req, res) => {
	try {
		const userId = req.userId;
		const groupId = req.body.id;
		if (!userId) res.status(400).json({ message: "User not Authorized" });
		if (!groupId) res.status(400).json({ message: "Invalid data" });
		const targetGrpId = new mongoose.Types.ObjectId(req.body.id);
		const currentUserId = new mongoose.Types.ObjectId(req.userId);
		const existGroup = groupModel.findById(targetGrpId);
		if (!existGroup) res.status(400).json({ message: "Group is not exist" });
		const existContact = contactModel.findOne({ userId: currentUserId });
		if (!existContact)
			res.status(400).json({ message: "Contact is not exist" });
		// existGroup.participants.pull(currentUserId);
		// const filteredParticipants = existGroup.participants.filter(
		// 	(id) => id !== currentUserId
		// );
		// existGroup.participants = filteredParticipants;
		// await existGroup.save();
		// const filteredChats = existContact.chatList.filter(
		// 	(data) => data.chat !== targetGrpId
		// );
		// existContact.chatList = filteredChats;
		// existContact.chatList.pull({ type: "Group", chat: targetGrpId });

		// await existContact.save();
		await Promise.all([
			existGroup.participants.pull(currentUserId),
			existGroup.save(),
			existContact.chatList.pull({ type: "Group", chat: targetGrpId }),
			existContact.save(),
		]);

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
			{ path: "followings" },
			{ path: "followers" },
		];
		existContact.populate(populateOptions);
		console.log(existContact);

		console.log(existContact.chatList[0]);
		res.status(200).json({
			contacts: existContact.chatList,
			followings: existContact.followings,
			followers: existContact.followers,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
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
		if (!channelName ) res.status(400).json({ message: "Invalid data" });
		const currentUserId = new mongoose.Types.ObjectId(userId);
		// const existingData = await userModel.find({ _id: { $in: Ids } });
		// console.log(existingData);
		// if (!existingData || existingData.length !== Ids.length)
		// 	res.status(404).json({ message: "Users are not valid" });
		const newChannel = await groupModel.create({
			chatName: channelName,
			creator: userId,
			admins: [userId],
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
			{ path: "followings" },
			{ path: "followers" },
		];

		const userContacts = await contactModel.findOne({ userId: currentUserId });
		userContacts.chatList.push({ type: "Channel", chat: newChannel._id });
		await userContacts.save();
		await userContacts.populate(populateOptions);
		res.status(200).json({
			contacts: userContacts.chatList,
			followings: userContacts.followings,
			followers: userContacts.followers,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};
// export const getAllChannels = async (req, res) => {
// 	try {
// 		const groups = await groupModel.find()
// 		res.status(200).json(groups)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.message || "Something went wrong" });
// 	}};
// export const joinChannel = async (req, res) => {
// 	try {
// 		const groups = await groupModel.find()
// 		res.status(200).json(groups)
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.message || "Something went wrong" });
// 	}};
