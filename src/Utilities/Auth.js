import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// ----------Token generating and varifying----------------
export const tokenCreator = async (Data) =>
	await Jwt.sign(
		{
			email: Data.email,
			id: Data._id,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);

export const tokenChecker = async (token) =>
	await Jwt.verify(token, process.env.JWT_SECRET);

// ----------Password hashing and comparing----------------
export const bcryptHash = async (password) => await bcrypt.hash(password, 10);
export const bcryptCompare = async (password, compare) =>
	await bcrypt.compare(password, compare);

// ----------OTP Generator----------------
export const generateOTP = () =>
	Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
