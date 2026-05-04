import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({}, { timestamps: true });

export const Post = models.Post || model("Post", PostSchema);
