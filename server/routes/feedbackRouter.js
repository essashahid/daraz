import express from "express";
// import FeedbackModel from "../models/feedback.js";

const feedbackRouter = express.Router();

// feedbackRouter.get("/check", async (req, res) => {
//   const { oid, pid } = req.query;
//   try {
//     const feedbackExists = await FeedbackModel.findOne({ oid, pid });
//     res.status(200).json({ exists: !!feedbackExists });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: "error", message: "Error checking feedback" });
//   }
// });

// feedbackRouter.post("/submit", (req, res) => {
//   const newFeedback = new FeedbackModel({
//     oid: req.body.oid,
//     pid: req.body.pid, // Include product ID in feedback
//     supplier_rating: req.body.supplier_rating,
//     service_rating: req.body.service_rating,
//   });

//   newFeedback.save()
//     .then(() => {
//       res.status(201).json({ status: "success", message: "Feedback submitted successfully" });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ status: "error", message: "Error submitting feedback" });
//     });
// });

// feedbackRouter.put("/update/:feedbackId", (req, res) => {
//   FeedbackModel.findByIdAndUpdate(req.params.feedbackId, req.body, { new: true })
//     .then((updatedFeedback) => {
//       res.status(200).json({ status: "success", data: updatedFeedback });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ status: "error", message: "Error updating feedback" });
//     });
// });

// feedbackRouter.get("/:feedbackId", (req, res) =>
// {
//   FeedbackModel.findById(req.params.feedbackId)
//     .then((feedback) => {
//       if (feedback) {
//         res.status(200).json({ status: "success", data: feedback });
//       } else {
//         res.status(404).json({ status: "error", message: "Feedback not found" });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ status: "error", message: "Error retrieving feedback" });
//     });
// });

export default feedbackRouter;
