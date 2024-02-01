import express from "express";
import { getAllGrpMessages, getAllMessages, postGrpMessages, postMessages } from "../Controller/Chat.js";
const chatRoute = express.Router();
chatRoute.route("/private/:id").get(getAllMessages).post(postMessages);
chatRoute.route("/group/:id").get(getAllGrpMessages).post(postGrpMessages);

export default chatRoute;
