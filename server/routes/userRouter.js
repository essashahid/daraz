import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import UserModel from "../models/user.js";

const userRouter = express.Router();
const saltRounds = 10;

userRouter.get("/list", async (req, res) => {
  await UserModel.deleteMany({});
  return res
    .status(200)
    .json({ status: "success", message: "Deleted all users" });
  try {
    const users = await UserModel.find({});
    res.status(200).json({ status: "success", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error during search" });
  }
});

userRouter.delete(":email", async (req, res) => {
  try {
    console.log("Attempting to delete customer with email:", req.params.email);
    await UserModel.deleteOne({ email: req.params.email });
    console.log("Customer deleted successfully");
    res
      .status(200)
      .json({ status: "success", message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

userRouter.patch("", async (req, res) => {
  try {
    await UserModel.updateOne({ email: req.body.email }, { $set: req.body });

    res.status(200).json({
      status: "success",
      message: "Customer updated successfully",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    console.log("User found:", user);

    if (!user) {
      console.log("No user found with that email", req.body.email);
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: "6h",
      }
    );
    const match = bcrypt.compare(req.body.password, user.password);
    if (!match) {
      console.log("Password mismatch for user", user);
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }
    console.log("Login successful for user", user.role);
    res.status(200).json({
      userID: user._id,
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    console.log("Received signup data:", req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      userID: user._id,
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", message: err.message });
  }
});

export default userRouter;
