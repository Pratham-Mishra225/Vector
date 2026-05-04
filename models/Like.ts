import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
	},
	{ timestamps: true }
);

export const Like = models.Like || model("Like", LikeSchema);
