import express from "express";
import {
	getAllUserContacts,
	toggleFollowStatus,
	createGroup,
	createChannel,
	getAllChannels,
	joinChannel,
	removeChat,
	exitGroup,
} from "../Controller/Contact.js";
import { checkConnection, createConnection } from "../Controller/Connection.js";

const contactRoute = express.Router();
contactRoute
	.route("/user")
	.get(getAllUserContacts)
	.patch(toggleFollowStatus)
	.delete(removeChat);
contactRoute.route("/group").post(createGroup).patch(exitGroup);
contactRoute
	.route("/channel")
	.post(createChannel)
	.get(getAllChannels)
	.patch(joinChannel);
contactRoute
	.route(`/connection/:id`)
	.get(checkConnection)
	.post(createConnection);


export default contactRoute;
