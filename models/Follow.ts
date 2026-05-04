import { Schema, model, models } from "mongoose";

const FollowSchema = new Schema({}, { timestamps: true });

export const Follow = models.Follow || model("Follow", FollowSchema);
