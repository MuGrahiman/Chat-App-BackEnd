import express from "express";
import { getAllUserContacts, toggleFollowStatus } from "../Controller/Contact.js";
const contactRoute = express.Router();
contactRoute.route("/").get(getAllUserContacts).patch(toggleFollowStatus);
export default contactRoute;
