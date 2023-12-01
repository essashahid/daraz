import express from "express";
import FeedbackModel from "../models/feedback.js";

const feedbackrouter = express.Router();

// get password done
// update info done
// create customer done

feedbackrouter.post("/get-password", (req, res) => {
  FeedbackModel
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

feedbackrouter.post("/update-info", (req, res) => {
  FeedbackModel
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

feedbackrouter.post("/create-customer", (req, res) => {
  const Customer = new FeedbackModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  Customer.save()
    .then(() => {
      res.status(201).json({ status: "success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
});

export default feedbackrouter;