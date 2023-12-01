import express from "express";
import CustomerModel from "../models/customer.js";
import bcrypt from "bcrypt";


const customerRouter = express.Router();
const saltRounds = 10;


customerRouter.delete("/delete-customer/:email", async (req, res) => {
  try {
      console.log("Attempting to delete customer with email:", req.params.email); // Log the received email

      const result = await CustomerModel.deleteOne({ email: req.params.email });

      console.log("Deletion result:", result); // Log the result of the delete operation

      if(result.deletedCount === 0){
          console.log("No customer found with the provided email."); // Additional log for clarity
          return res.status(404).json({ status: "error", message: "No customer found with the provided email." });
      }

      console.log("Customer deleted successfully");
      res.status(200).json({ status: "success", message: "Customer deleted successfully" });

  } catch (err) {
      console.log("Error in delete operation:", err); // Log any errors encountered during the operation
      res.status(500).json({ status: "error", message: "Internal server error" });
  }
});


customerRouter.post("/get-password", (req, res) => {
  CustomerModel
    .find({ password: req.body.password })
    // .select({ email: 1, password: 1 })
    .then((result) => {
      console.log(result);
      res.status(201).json({ status: "success", data: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
    });
});

customerRouter.post("/update-info", (req, res) => {
  CustomerModel
    .updateOne({ email: req.body.email }, { $set: req.body })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Customer updated successfully",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    });
});

customerRouter.post("/login", async (req, res) => {
  try {
    const customer = await CustomerModel.findOne({ email: req.body.email });
    if (!customer) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const match = await bcrypt.compare(req.body.password, customer.password);
    if (!match) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    // Include user's name and email in the response
    res.status(200).json({ 
      status: "success", 
      message: "Login successful",
      userName: customer.name, // Assuming 'name' field exists in CustomerModel
      userEmail: customer.email 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

customerRouter.post("/create-customer", async (req, res) => 
{
  try {
    console.log('Received signup data:', req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const customer = new CustomerModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await customer.save();
    res.status(201).json({ status: "success", message: "Customer created successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", message: err.message });
  }
});


export default customerRouter;