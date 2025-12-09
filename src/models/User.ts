import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    logo: { type: String, default: null },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
