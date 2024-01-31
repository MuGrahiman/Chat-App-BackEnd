import express from "express";
import { getAllMessages, postMessages } from "../Controller/Chat.js";
const chatRoute = express.Router();
chatRoute.route("/private/:id").get(getAllMessages).post(postMessages);
chatRoute.route("/group/:id").get(getAllMessages).post(postMessages);

export default chatRoute;
