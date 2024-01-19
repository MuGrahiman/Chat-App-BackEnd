import { generateOTP } from '../Utilities/Auth.js';
import OTPModel from '../Model/OTP.js';

export default class OTP {
	constructor(id) {
		this.otp = generateOTP();
		this.id = id;
	}
	createOTP(id) {
		return new Promise((resolve, reject) => {
			new OTPModel({
				userId: this.id,
				otp: this.otp,
			})
				.save()
				.then((savedOtp) => resolve(savedOtp))
				.catch((error) => reject(error));
		});
	}
}
