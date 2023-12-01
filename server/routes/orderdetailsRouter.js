import express from "express";
import OrderDetailsModel from "../models/orderdetails.js"; // Import the OrderDetails model

const orderdetailsRouter = express.Router();

// Endpoint to add order details
orderdetailsRouter.post("/add-order-details", async (req, res) => {
  try {
    const newOrderDetails = new OrderDetailsModel({
      pid: req.body.pid, // Product ID
      oid: req.body.oid, // Order ID
    });

    const savedOrderDetails = await newOrderDetails.save();
    res.status(201).json({ status: "success", data: savedOrderDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error adding order details" });
  }
});

// Endpoint to update order details
orderdetailsRouter.put("/update-order-details/:orderDetailsId", async (req, res) => {
  try {
    const updatedOrderDetails = await OrderDetailsModel.findByIdAndUpdate(
      req.params.orderDetailsId,
      req.body,
      { new: true } // Returns the updated document
    );

    if (!updatedOrderDetails) {
      return res.status(404).json({ status: "error", message: "Order details not found" });
    }

    res.status(200).json({ status: "success", data: updatedOrderDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error updating order details" });
  }
});

// Endpoint to get order details by ID
orderdetailsRouter.get("/get-order-details/:orderDetailsId", async (req, res) => {
  try {
    const orderDetails = await OrderDetailsModel.findById(req.params.orderDetailsId);

    if (!orderDetails) {
      return res.status(404).json({ status: "error", message: "Order details not found" });
    }

    res.status(200).json({ status: "success", data: orderDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error retrieving order details" });
  }
});

// Endpoint to delete order details
orderdetailsRouter.delete("/delete-order-details/:orderDetailsId", async (req, res) => {
  try {
    const result = await OrderDetailsModel.findByIdAndDelete(req.params.orderDetailsId);

    if (!result) {
      return res.status(404).json({ status: "error", message: "Order details not found" });
    }

    res.status(200).json({ status: "success", message: "Order details deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error deleting order details" });
  }
});

export default orderdetailsRouter;
