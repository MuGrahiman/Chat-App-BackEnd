import Auth from "../Helpers/Auth.js";
const auth = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		console.log(req.headers);
		if (!authorization || !authorization.startsWith("Bearer"))
			throw new Error("Authorization required");

		const token = authorization.split(" ")[1];
		if (!token) throw new Error("token required");
		console.log(token);

		const decodeData = await Auth.CheckToken(token);
		if (!decodeData) throw new Error("Not an valid Token");
		console.log(`decodeData in middleware `);
		console.log(decodeData);
		req.userId = decodeData?.id;
		next();
	} catch (error) {
		console.log(error);
		res.status(400).json(error.message);
	}
};
export default auth;
