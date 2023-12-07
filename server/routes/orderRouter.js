import express from "express";
import OrderModel from "../models/order.js"; // Import the Order model
import middleware from "../middleware/index.js";

const orderRouter = express.Router();

orderRouter.get("/list", async (req, res) => {
  try {
    const orders = await OrderModel.find({}).populate("products.product");
    res.status(200).json({ status: "success", data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error during search" });
  }
});

orderRouter.post("/feedback", async (req, res) => {
  const { orderID, productID, rating } = req.body;

  if (!rating) {
    return res.status(400).json({
      status: "error",
      message: "rating is required",
    });
  }

  try {
    // Find the order and update the feedback for the specific product
    const order = await OrderModel.findOne({ _id: orderID });
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Find the specific product in the order and update its feedback
    const product = order.products.find(
      (p) => p.product.toString() === productID
    );
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found in order",
      });
    }

    product.rating = rating;

    // Save the updated order
    await order.save();

    res.status(200).json({ status: "success", data: order });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error updating feedback" });
  }
});

// Endpoint to create a new order
orderRouter.post("/place", middleware, async (req, res) => {
  const products = req.body.products;
  const customerID = req.body.customerID;
  const amount = req.body.amount;

  if (!products || !customerID || !amount) {
    return res.status(400).json({
      status: "error",
      message: "Please provide product IDs, customer ID, and amount",
    });
  }
  const newOrder = new OrderModel({
    customerID: customerID,
    products: products,
    amount: amount,
  });

  const savedOrder = await newOrder.save();

  const createdOrder = await OrderModel.findById(savedOrder._id).populate(
    "products.product"
  );

  res.status(201).json({ status: "success", data: createdOrder });
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
      }).populate("products.product");
      res.status(200).json({ status: "success", data: orders });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Error retrieving orders" });
    }
  }
);

orderRouter.get(
  "/supplier-orders/:supplierID",
  middleware,
  async (req, res) => {
    try {
      const supplierID = req.params.supplierID;
      // console.log
      // console.log(supplierID);

      // Assuming your Order model has a reference to the supplier
      const orders = await OrderModel.find({ supplierId: supplierID }).populate(
        "products.product"
      );
      res.status(200).json({ status: "success", data: orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Error retrieving orders for supplier",
      });
    }
  }
);

orderRouter.get("/all", async (req, res) => {
  try {
    const orders = await OrderModel.find({}).populate("products"); // Assuming you want to populate product details in the orders
    res.status(200).json({ status: "success", data: { orders } });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error retrieving orders" });
  }
});

orderRouter.get('/supplier-feedback/:supplierId', async (req, res) => {
  try {
    const supplierOrders = await OrderModel.find({ "products.supplierId": req.params.supplierId })
      .populate({
        path: 'products.product',
        match: { supplierId: req.params.supplierId }
      });

    // Extract feedback from these orders
    const feedbacks = supplierOrders.map(order => {
      return order.products
        .filter(product => product.supplierId.toString() === req.params.supplierId)
        .map(product => {
          return {
            productId: product.product._id,
            productName: product.product.name,
            feedback: product.feedback // Assuming this is how feedback is stored
          };
        });
    }).flat();

    res.status(200).json({ status: "success", data: feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error retrieving supplier feedback" });
  }
});

export default orderRouter;
