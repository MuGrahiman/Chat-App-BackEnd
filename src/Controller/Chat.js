import messageModel from "../Model/Message.js";
import privateModel from "../Model/Private.js";
export const getAllMessages = async (req, res) => {
	try {
		console.log(req.params);
		console.log(req.query);
		const chatId = req.params.id;
		const userId = req.userId;
		// const msgType = req.body.msgType;
		// const chatType = req.body.chatType;
		// need an helper for handle group and private.
		console.log(`All Messages form chat '${chatId}' by ${userId}`);
		if (!chatId || !userId)
			return res.status(400).json({ Message: `invalid data` });
		const existChat = await privateModel.findById(chatId);
		console.log(existChat);
		if (!existChat)
			return res.status(404).json({ message: "Chat is not Valid" });
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
		res.status(200).json({ messages: populatedData.messages });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};
export const postMessages = async (req, res) => {
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
		const existChat = await privateModel.findById(chatId);
		console.log(existChat);
		if (!existChat)
			return res.status(404).json({ message: "Chat is not Valid" });

		const message = await messageModel.create({
			text: Text,
			sender: userId,
			type: "text",
		});
		existChat.messages.push(message._id);
		await existChat.save();
		const populateOptions = [
			{ path: "participants" },
			{
				path: "messages",
				// populate: {
				// 	path: "sender",
				// 	select: "userName",
				// },
			},
		];
		const populatedData = await existChat.populate(populateOptions);
		console.log(populatedData);
		console.log("==========================");
		await populatedData.populate({
			path: "messages.sender",
			select: "userName",
		});
		console.log(populatedData.messages);
		res.status(200).json({ messages: populatedData.messages });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "Something went wrong" });
	}
};
