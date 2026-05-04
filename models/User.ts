import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({}, { timestamps: true });

export const User = models.User || model("User", UserSchema);
