import { Schema, model, connect } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface User {
  name: string;
  about: string;
  email: string;
  password: string;
}

// 2. Create a Schema corresponding to the document interface.
export const userSchema = new Schema<User>({
  name: { type: String, required: true },
  about: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 3. Create a Model.
export const UserModel = model<User>("User", userSchema);
