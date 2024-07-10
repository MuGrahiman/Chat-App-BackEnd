import express from "express";
import { checkChatType, getAllGrpMessages, getAllMessages, getPrivateChat, postGrpMessages, postMessages, postPrivateChat } from "../Controller/Chat.js";
const chatRoute = express.Router();
chatRoute.route("/:chatId").get(checkChatType).post(checkChatType);
chatRoute.route("/private/:id").get(getPrivateChat).post(postPrivateChat);   
chatRoute.route("/group/:id").get(getAllGrpMessages).post(postGrpMessages);
chatRoute
	.route("/channel/:id")
	.get(getAllMessages)
	.post((req, res) => console.log(req));
chatRoute.route("/msg/:msgId").get(getAllMessages).post(postMessages);

export default chatRoute;
