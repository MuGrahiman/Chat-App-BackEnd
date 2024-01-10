import express from "express";
import { createUser } from "../Controller/userAth.js";
const userRoute = express.Router();
userRoute.post("/user/register", createUser);
export default userRoute;
