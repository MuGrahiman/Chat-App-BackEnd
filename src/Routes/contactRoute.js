import express from "express";
import {
	getAllUserContacts,
	toggleFollowStatus,
	createGroup,
	createChannel,
	// joinGroup,
	// getAllGroups,
} from "../Controller/Contact.js";
const contactRoute = express.Router();
contactRoute.route("/user").get(getAllUserContacts).patch(toggleFollowStatus);
contactRoute.route("/group").post(createGroup);
contactRoute.route("/channel").post(createChannel);
// .get(getAllChannels)
// .patch(joinChannel);
export default contactRoute;
