import mongoose from "mongoose";
import contactModel from "../Model/Contacts.js";
import userModel from "../Model/User.js";
import PrivateModel from "../Model/Private.js";
import groupModel from "../Model/Group.js";

export const getAllUserContacts = async (req, res) => {
	try {
		console.log("req.userId");
		const { userId } = req;
		if (!userId) res.status(400).json({ message: "User not found" });
		const user = new mongoose.Types.ObjectId(userId);
		const contacts = await contactModel
			.findOne({ userId: user })
			.populate("chatList.chat")
			.populate("followings")
			.populate("followers");
		const populateOptions = [
			{ path: "chatList.chat", model: "Private" }, // Replace "Private" with your actual model name
			{ path: "chatList.chat", model: "Group" }, // Replace "Group" with your actual model name
		];
		const cntctDetail = await contactModel.populate(contacts, populateOptions);
		console.log(cntctDetail);
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

// export const toggleFollowStatus = async (req, res) => {
// 	try {
// 		console.log(`in the toggleFollowStatus with id :${req.body.id}`);
// 		const targetUserId = new mongoose.Types.ObjectId(req.body.id);
// 		const currentUserId = new mongoose.Types.ObjectId(req.userId);
// 		const targetUser = await userModel.findById(targetUserId);
// 		console.log(targetUser);
// 		if (!targetUser)
// 			return res.status(404).json({ message: "target user Id is not Valid" });
// 		const currentUser = await userModel.findById(currentUserId);
// 		console.log(currentUser);
// 		if (!currentUser)
// 			return res.status(404).json({ message: "current user Id is not Valid" });

// 		const targetUserContact = await contactModel.findOne({
// 			userId: targetUserId,
// 		});
// 		if (!targetUserContact)
// 			return res
// 				.status(404)
// 				.json({ message: "target user contact could`nt found" });

// 		const currentUserContact = await contactModel.findOne({
// 			userId: currentUserId,
// 		});
// 		if (!currentUserContact)
// 			return res
// 				.status(404)
// 				.json({ message: "current user contact could`nt found" });

// 		console.log(currentUserContact.followings.includes(targetUserId));
// 		if (currentUserContact.followings.includes(targetUserId)) {
// 			const updatedStatus = currentUserContact.followings.filter(
// 				(id) => !id.equals(targetUserId)
// 			);
// 			currentUserContact.followings = updatedStatus;
// 		} else currentUserContact.followings.push(targetUserId);

// 		console.log(targetUserContact.followers.includes(currentUserId));
// 		if (targetUserContact.followers.includes(currentUserId)) {
// 			const updatedStatus = targetUserContact.followers.filter(
// 				(id) => !id.equals(currentUserId)
// 			);
// 			targetUserContact.followers = updatedStatus;
// 		} else targetUserContact.followers.push(currentUserId);

// 		await currentUserContact.save();
// 		await targetUserContact.save();
// 		res.status(200).json({
// 			contacts: currentUserContact.chatList,
// 			followings: currentUserContact.followings,
// 			followers: currentUserContact.followers,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ message: error.message || "something went wrong" });
// 	}
// };

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
		const existPrivateChat = await PrivateModel.find({
			participants: { $all: participantIds },
		});
		if (!existPrivateChat[0]) {
			const privateChat = await PrivateModel.create({
				participants: participantIds,
			});
			currentUserContact.chatList.push({
				type: "private",
				chat: privateChat._id,
			});
			targetUserContact.chatList.push({
				type: "private",
				chat: privateChat._id,
			});
		}
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
