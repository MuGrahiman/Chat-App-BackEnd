import express from "express";
import { getAllGrpMessages, getAllMessages, postGrpMessages, postMessages } from "../Controller/Chat.js";
const chatRoute = express.Router();
chatRoute.route("/chat/:chatId").get(getAllMessages).post(postMessages);
chatRoute.route("/private/:id").get(getAllMessages).post(postMessages);
chatRoute.route("/group/:id").get(getAllGrpMessages).post(postGrpMessages);
chatRoute
	.route("/channel/:id")
	.get(getAllMessages)
	.post((req, res) => console.log(req));
chatRoute.route("/msg/:msgId").get(getAllMessages).post(postMessages);

export default chatRoute;
