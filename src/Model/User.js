import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	userName: { type: String, unique: true, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, minlength: 8, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	profilePic: {
		type: String,
		default:
			"https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png",
	},
	contact: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contact",
	},
	authorization: { type: String, default: "pending", required: true }, //authorization:  'pending' | 'verified' | 'blocked'
});

export default mongoose.model("User", userSchema);
