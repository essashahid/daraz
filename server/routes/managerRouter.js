import express from "express";
import ManagerModel from "../models/manager.js";

const managerRouter = express.Router();

// get password done
// update info done
// create manager done

managerRouter.delete("/delete-manager/:email", async (req, res) => {
  try {
      console.log("Attempting to delete manager with email:", req.params.email);

      const result = await ManagerModel.deleteOne({ email: req.params.email });

      console.log("Deletion result:", result);

      if (result.deletedCount === 0) {
          console.log("No manager found with the provided email.");
          return res.status(404).json({ status: "error", message: "No manager found with the provided email." });
      }

      console.log("Manager deleted successfully");
      res.status(200).json({ status: "success", message: "Manager deleted successfully" });

  } catch (err) {
      console.log("Error in delete operation:", err);
      res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

managerRouter.post("/get-password", (req, res) => {
  ManagerModel
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

managerRouter.post("/update-info", (req, res) => {
  ManagerModel
    .updateOne({ email: req.body.email }, { $set: req.body })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "manager updated successfully",
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

managerRouter.post("/create-manager", (req, res) => {
  const manager = new ManagerModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  manager.save()
    .then((savedManager) => { // Note the change here
      res.status(201).json({
        status: "success",
        message: "Manager created successfully",
        managerId: savedManager._id // Returning the ID of the newly created manager
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ status: "error", message: "Error creating manager" });
    });
});

export default managerRouter;