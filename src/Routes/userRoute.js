import express from 'express';
import AuthProtector from '../Middleware/Auth.js'
import {
	checkOtp,
	createUser,
	getAllUser,
	getUser,
	sendOtp,
	userLogin,
} from '../Controller/Auth.js';
const userRoute = express.Router();
userRoute.post('/user/register', createUser);
userRoute.route('/otp/:id').get(sendOtp).post(checkOtp);
userRoute.post('/user/login', userLogin);
userRoute.get("/user/get/all", AuthProtector, getAllUser);
userRoute.get("/user/get/:id", AuthProtector, getUser);
export default userRoute;
