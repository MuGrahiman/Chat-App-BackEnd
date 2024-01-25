import express from 'express';
import AuthProtector from '../Middleware/Auth.js'
import {
	checkOtp,
	createUser,
	getAllUser,
	sendOtp,
	userLogin,
} from '../Controller/Auth.js';
const userRoute = express.Router();
userRoute.post('/user/register', createUser);
userRoute.post('/user/login', userLogin);
userRoute.route('/otp/:id').get(sendOtp).post(checkOtp);
userRoute.get("/user/get",AuthProtector, getAllUser);
export default userRoute;
