import OTP from "../Helpers/OTP.js";
import userModel from "../Model/User.js";
import contactModel from "../Model/Contacts.js";
import OTPModel from "../Model/OTP.js";
import Auth from "../Helpers/Auth.js";

export const createUser = async (req, res) => {
	const { userName, password, firstName, lastName, email } = req.body;
	try {
		const existUser = await userModel.findOne({ userName, email });
		const existName = await userModel.findOne({ userName });
		const existMail = await userModel.findOne({ email });
		console.log("existName" + existName + " " + "existMail" + existMail);
		console.log("existUser" + existUser);
		if (existUser && existUser.authorization === "pending")
			return res.redirect(`/api/otp/${existUser._id}`);

		if (existName || existMail)
			return res.status(404).json({ message: "data already exist" });

		const hashedPassword = await Auth.Encrypt(password);
		const newUser = new userModel({
			userName,
			password: hashedPassword,
			firstName,
			lastName,
			email,
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
	const existUser = await userModel.findOne({ email: req.body.email });
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
	const { lastName, firstName, email, _id: id, userName } = existUser;
	res.status(200).json({ id, userName, lastName, firstName, email, token });
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
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "something went wrong" });
	}
};

export const checkOtp = async (req, res) => {
	try {
		console.log(`In the checkOtp with Id: ${req.params.id}`);
		console.log(req.body);
		if (!req.params.id) return res.status(404).json({ message: "id required" });

		const OTP = await OTPModel.findById(req.params.id);
		console.log(OTP);
		if (!OTP)
			return res
				.status(404)
				.json({ message: "OTP not found . please register once more" });
		if (OTP.otp != req.body.otp)
			return res.status(404).json({ message: "otp not verified" });

		const existUser = await userModel.findById(OTP.userId);
		console.log(existUser);
		if (!existUser)
			return res.status(404).json({ message: "user not verified" });

		const contact = await contactModel.create({ userId: existUser._id });
		existUser.authorization = "verified";
		existUser.contact = contact._id;
		await existUser.save();
		res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "something went wrong" });
	}
};

export const searchUser = async (req, res) => {
	try {
		const isUser = req.query.search
			? {
					$or: [
						{ name: { $regex: req.query.search, $option: "i" } },
						{ email: { $regex: req.query.search, $option: "i" } },
					],
			  }
			: {};
		const user = await userModel
			.find(isUser)
			.find({ _id: { $ne: req.user._id } });

		return res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "something went wrong" });
	}
};

export const getAllUser = async (req, res) => {
	console.log(req.userId);
	try {
		const user = await userModel.find({ _id: { $ne: req.userId } });
		console.log(user && user.length);

		return res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message || "something went wrong" });
	}
};
