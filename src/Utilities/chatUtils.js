import privateModel from "../Model/Private.js";
import channelModel from "../Model/Channel.js";
import groupModel from "../Model/Group.js";

const chatTypeDetector = async (chatId) => {
	const isPrivateValid = await privateModel.exists({ _id: chatId });
	const isGroupValid = await groupModel.exists({ _id: chatId });
	const isChannelValid = await channelModel.exists({ _id: chatId });

	if (isPrivateValid) return  "private" ;
	else if (isGroupValid) return  "group" ;
	else if (isChannelValid) return  "channel" ;
	else return  null ;
};

export default chatTypeDetector