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
	checkConnection,
	createConnection,
} from "../Controller/Contact.js";

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
