import express from "express";
import OrderModel from "../models/order.js"; // Import the Order model
import middleware from "../middleware/index.js";

const orderRouter = express.Router();

orderRouter.get("/list", async (req, res) => {
  try {
    const orders = await OrderModel.find({}).populate("products");
    res.status(200).json({ status: "success", data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error during search" });
  }
});

// Endpoint to create a new order
orderRouter.post("/place", middleware, async (req, res) => {
  const productIDs = req.body.products;
  const customerID = req.body.customerID;
  const amount = req.body.amount;

  const date = new Date();

  try {
    const newOrder = new OrderModel({
      date: date,
      customerID: customerID,
      products: productIDs,
      amount: amount,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json({ status: "success", data: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error creating order" });
  }
});

// Endpoint to update an order
orderRouter.patch("/:orderId", async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    res.status(200).json({ status: "success", data: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error updating order" });
  }
});

// Endpoint to get an order by ID
orderRouter.get("/:orderId", middleware, async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);

    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    res.status(200).json({ status: "success", data: order });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error retrieving order" });
  }
});

orderRouter.delete("/:orderId", async (req, res) => {
  try {
    const result = await OrderModel.findByIdAndDelete(req.params.orderId);

    if (!result) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error deleting order" });
  }
});

orderRouter.get(
  "/customer-orders/:customerID",
  middleware,
  async (req, res) => {
    try {
      const orders = await OrderModel.find({
        customerID: req.params.customerID,
      }).populate("products");
      res.status(200).json({ status: "success", data: orders });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Error retrieving orders" });
    }
  }
);

export default orderRouter;
