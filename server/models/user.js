import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "supplier", "manager"],
    required: true,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
