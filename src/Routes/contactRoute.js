import express from "express";
import {
	getAllUserContacts,
	toggleFollowStatus,
	// joinGroup,
	createGroup,
	// getAllGroups,
} from "../Controller/Contact.js";
const contactRoute = express.Router();
contactRoute.route("/user").get(getAllUserContacts).patch(toggleFollowStatus);
contactRoute
	.route("/group")
	// .get(getAllGroups)
	.post(createGroup)
	// .patch(joinGroup);
export default contactRoute;
