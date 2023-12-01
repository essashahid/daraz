import express from "express";
import OrderModel from "../models/order.js"; // Import the Order model

const orderRouter = express.Router();

// Endpoint to create a new order
orderRouter.post("/create-order", async (req, res) => {
  try {
    const newOrder = new OrderModel({
      date: req.body.date,
      amount: req.body.amount,
      cid: req.body.cid, // Customer ID
      sid: req.body.sid, // Supplier ID
      mid: req.body.mid, // Manager ID
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ status: "success", data: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error creating order" });
  }
});

// Endpoint to update an order
orderRouter.put("/update-order/:orderId", async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    res.status(200).json({ status: "success", data: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error updating order" });
  }
});

// Endpoint to get an order by ID
orderRouter.get("/get-order/:orderId", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    res.status(200).json({ status: "success", data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error retrieving order" });
  }
});

// Endpoint to delete an order
orderRouter.delete("/delete-order/:orderId", async (req, res) => {
  try {
    const result = await OrderModel.findByIdAndDelete(req.params.orderId);

    if (!result) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    res.status(200).json({ status: "success", message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error deleting order" });
  }
});

export default orderRouter;
