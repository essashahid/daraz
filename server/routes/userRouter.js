import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import UserModel from "../models/user.js";

// import FeedbackModel from "../models/feedback.js";
import ProductModel from "../models/product.js";
import middleware from "../middleware/index.js";

const userRouter = express.Router();
const saltRounds = 10;

userRouter.get("/list", async (req, res) => {
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
    // console.log("User found:", user);

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

userRouter.put("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { name, email } },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "Supplier not found" });
    }

    res.json({ status: "success", data: updatedUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error updating supplier details" });
  }
});

// userRouter.get('/supplier-feedback/:supplierId', async (req, res) => {
//   const { supplierId } = req.params;
//   try {
//     // Fetch products supplied by this supplier
//     const products = await ProductModel.find({ supplierId });

//     // Extract product IDs
//     const productIds = products.map(product => product._id);

//     // Fetch feedbacks for these products
//     const feedbacks = await FeedbackModel.find({ pid: { $in: productIds } }).populate('pid', 'name');

//     res.json({ status: 'success', data: feedbacks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Error fetching feedback' });
//   }
// });

userRouter.get("/customers", middleware, async (req, res) => {
  try {
    // Fetch all customer
    const customers = await UserModel.find({ role: "customer" });
    // use console.log to display customer
    console.log("CUSTOMERS ARE: ");
    console.log(customers);
    res.status(200).json({ status: "success", data: customers });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error fetching customers" });
  }
});

export default userRouter;
