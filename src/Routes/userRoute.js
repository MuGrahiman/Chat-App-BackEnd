import express from 'express';
import {
	checkOtp,
	createUser,
	sendOtp,
	userLogin,
} from '../Controller/Auth.js';
const userRoute = express.Router();
userRoute.post('/user/register', createUser);
userRoute.post('/user/login', userLogin);
userRoute.route('/otp/:id').get(sendOtp).post(checkOtp);
export default userRoute;
