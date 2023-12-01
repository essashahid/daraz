import express from "express";
import SupplierModel from "../models/supplier.js";

const supplierRouter = express.Router();

// get password done
// update info done
// create Supplier done


supplierRouter.delete("/delete-supplier/:email", (req, res) => {
  console.log(`Delete request for supplier with email: ${req.params.email}`);

  SupplierModel
    .deleteOne({ email: req.params.email })
    .then((result) => {
      console.log(`Deletion result for ${req.params.email}:`, result);

      if (result.deletedCount === 0) {
        console.log(`Supplier not found for email: ${req.params.email}`);
        return res.status(404).json({ status: "error", message: "Supplier not found" });
      }

      console.log(`Supplier with email ${req.params.email} deleted successfully`);
      res.status(200).json({ status: "success", message: "Supplier deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error deleting supplier with email ${req.params.email}:`, err);
      res.status(500).json({ status: "error", message: "Internal server error" });
    });
})

supplierRouter.post("/get-password", (req, res) => {
  SupplierModel
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

supplierRouter.post("/update-info", (req, res) => {
  SupplierModel
    .updateOne({ email: req.body.email }, { $set: req.body })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Supplier updated successfully",
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

supplierRouter.post("/create-Supplier", (req, res) => {
  const Supplier = new SupplierModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  Supplier.save()
    .then(() => {
      res.status(201).json({ status: "success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
});

export default supplierRouter;