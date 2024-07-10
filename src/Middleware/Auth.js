import Auth from "../Helpers/Auth.js";
import userModel from "../Model/User.js";
const auth = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization || !authorization.startsWith("Bearer"))
			throw new Error("Authorization required");

		const token = authorization.split(" ")[1];
		console.log("🚀 ~ auth ~ token:", token);
		if (!token) throw new Error("token required");

		const decodeData = await Auth.CheckToken(token);
		console.log("🚀 ~ auth ~ decodeData:", decodeData);
		if (!decodeData) throw new Error("Not an valid Token");

		const isValid = await userModel.exists({ _id: decodeData?.id });
		console.log("🚀 ~ auth ~ isValid:", isValid);
		if (!isValid) throw new Error("Not an valid user");

		req.userId = decodeData?.id;
		next();

	} catch (error) {

		console.log("🚀 ~ auth ~ error:", error);
		res.status(400).json(error.message);
		
	}
};
export default auth;
