import { Schema, model, models } from "mongoose";

const LikeSchema = new Schema({}, { timestamps: true });

export const Like = models.Like || model("Like", LikeSchema);
