import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Users || mongoose.model("Users", UserSchema);
