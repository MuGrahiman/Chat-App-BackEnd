import OTP from "../Helpers/OTP.js";
import userModel from "../Model/User.js";
import OTPModel from "../Model/OTP.js";
import { bcryptHash } from "../Utilities/Auth.js";
import Auth from "../Helpers/Auth.js";

export const createUser = async (req, res) => {
	const { userName, password, firstName, lastName, emailId } = req.body;
	try {
		const existUser = await userModel.findOne({ userName, emailId });
		const existName = await userModel.findOne({ userName });
		const existMail = await userModel.findOne({ emailId });
		console.log("existName" + existName + " " + "existMail" + existMail);
		console.log("existUser" + existUser);
		if (existUser && existUser.authorization === "pending") {
			res.redirect(`/api/otp/${existUser._id}`);
		}
		if (existName || existMail)
			return res.status(404).json({ message: "data already exist" });

		const hashedPassword = await bcryptHash(password);
		const newUser = new userModel({
			userName,
			password: hashedPassword,
			firstName,
			lastName,
			emailId,
		});
		await newUser.save();
		console.log("newUser");
		console.log(newUser);
		res.redirect(`/api/otp/${newUser._id}`);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "something went wrong" });
	}
};

export const userLogin = async (req, res) => {
	console.log(req.body);
	const existUser = await userModel.findOne({ emailId: req.body.email });
	console.log(existUser);
	if (!existUser || existUser.authorization === "pending")
		return res
			.status(404)
			.json({ message: "you are not authorized . please sign up" });
	if (existUser && existUser.authorization === "blocked")
		return res
			.status(404)
			.json({ message: "you are blocked by the admin . please contact admin" });

	const verifiedPassword = await Auth.Decrypt(
		req.body.password,
		existUser.password
	);
	console.log(verifiedPassword);
	if (!verifiedPassword)
		return res.status(404).json({ message: "password couldn't match" });
	const token = await Auth.CreateToken(existUser);
	const { lastName, firstName, emailId, _id: id, userName } = existUser;
	res.status(200).json({ id, userName, lastName, firstName, emailId, token });
};

export const sendOtp = async (req, res) => {
	try {
		console.log(`In the sendOtp with Id ${req.params}`);
		const user = await userModel.findById(req.params.id);
		console.log(user);
		if (!user)
			return res.status(404).json({ message: "couldn't find the user" });

		const otp = await new OTP(user._id).createOTP();

		console.log({ otp });
		if (otp) return res.status(200).json({ otpId: otp._id, userId: user._id });
		else return res.status(404).json({ message: "something went wrong" });
	} catch (error) {}
};

export const checkOtp = async (req, res) => {
	try {
		console.log(`In the checkOtp with Id ${req.params}`);
		const otp = await OTPModel.findById(req.params.id);
		if (!otp) return res.status(404).json({ message: "otp not verified" });
		const existUser = await userModel.findById(otp.userId);
		if (!existUser)
			return res.status(404).json({ message: "user not verified" });
		existUser.authorization = "verified";
		await existUser.save();
		res.status(200).json({ success: true });
	} catch (error) {}
};
