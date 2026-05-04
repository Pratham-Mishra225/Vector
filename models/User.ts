import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		bio: { type: String, default: "" },
		avatar: { type: String, default: "" },
	},
	{ timestamps: true }
);

export const User = models.User || model("User", UserSchema);
