import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  // add more fields as needed
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // add more fields as needed
});

export default mongoose.model<IUser>("Users", UserSchema);
