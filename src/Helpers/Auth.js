import {
	bcryptCompare,
	bcryptHash,
	tokenChecker,
	tokenCreator,
} from '../Utilities/Auth.js';

export default class Auth {
	constructor() {}
	static Encrypt(password) {
		return bcryptHash(password);
	}
	static Decrypt(password, compare) {
		return bcryptCompare(password, compare);
	}
	static CreateToken(data) {
		return tokenCreator(data);
	}
	static CheckToken(token) {
		return tokenChecker(token);
	}
}
