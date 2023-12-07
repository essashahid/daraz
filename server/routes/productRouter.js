import express from "express";
import UserModel from "../models/user.js";
import ProductModel from "../models/product.js";
import middleware from "../middleware/index.js";
import OrderModel from "../models/order.js";

const productRouter = express.Router();

const adjectives = [
  "Amazing",
  "Brilliant",
  "Creative",
  "Dynamic",
  "Elegant",
  "Fancy",
  "Glorious",
];
const nouns = [
  "Gadget",
  "Tool",
  "Device",
  "Item",
  "Product",
  "Invention",
  "Mechanism",
];

productRouter.get("/create-random", async (req, res) => {
  const randomSupplier = await UserModel.findOne({ role: "supplier" });
  if (!randomSupplier) {
    return res
      .status(404)
      .json({ status: "error", message: "Supplier not found" });
  }

  try {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomName = `${randomAdjective} ${randomNoun}`;

    const product = new ProductModel({
      name: randomName,
      price: Math.floor(Math.random() * 1000),
      supplierId: randomSupplier._id,
    });

    const savedProduct = await product.save();
    res.status(201).json({ status: "success", data: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error adding product" });
  }
});

productRouter.post("/create-custom", async (req, res) => {
  const { supplierId, name, price } = req.body;

  const supplierExists = await UserModel.exists({
    _id: supplierId,
    role: "supplier",
  });
  if (!supplierExists) {
    return res
      .status(404)
      .json({ status: "error", message: "Supplier not found" });
  }

  try {
    const product = new ProductModel({
      name: name || `Custom Product ${Math.floor(Math.random() * 100)}`,
      price: price || Math.floor(Math.random() * 1000),
      supplierId: supplierId,
      inStock: true,
    });

    const savedProduct = await product.save();
    res.status(201).json({ status: "success", data: savedProduct });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error creating custom product" });
  }
});

productRouter.post("/create", async (req, res) => {
  const randomSupplier = await UserModel.findOne({ role: "supplier" });
  if (!randomSupplier) {
    return res
      .status(404)
      .json({ status: "error", message: "Supplier not found" });
  }

  try {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomName = `${randomAdjective} ${randomNoun}`;

    const product = new ProductModel({
      name: randomName,
      rating: Math.floor(Math.random() * 5),
      price: Math.floor(Math.random() * 1000),
      supplierId: randomSupplier._id,
      inStock: true,
    });

    const savedProduct = await product.save();
    res.status(201).json({ status: "success", data: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error adding product" });
  }
});

productRouter.get("/list", middleware, async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json({ status: "success", data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error during search" });
  }
});

productRouter.get(
  "/supplier-products/:supplierId",
  middleware,
  async (req, res) => {
    try {
      const products = await ProductModel.find({
        supplierId: req.params.supplierId,
      });
      res.status(200).json({ status: "success", data: products });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Error retrieving products" });
    }
  }
);

productRouter.get(
  "/supplier-orders/:supplierId",
  middleware,
  async (req, res) => {
    try {
      const products = await ProductModel.find({
        supplierId: req.params.supplierId,
      }).select("_id");

      const productIds = products.map((product) => product._id);

      const orders = await OrderModel.find({
        "products.product": { $in: productIds },
      })
        .populate("customerID")
        .populate("products.product");

      res.status(200).json({ status: "success", data: orders });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Error retrieving supplier orders" });
    }
  }
);

productRouter.post("/add-product", async (req, res) => {
  try {
    const newProduct = new ProductModel({
      name: req.body.name,
      rating: req.body.rating,
      price: req.body.price,
      supplierId: req.body.supplierId,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ status: "success", data: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error adding product" });
  }
});

productRouter.get("/all", async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json({ status: "success", data: { products } });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Error retrieving products" });
  }
});

productRouter.delete("/:productId", async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndRemove(req.params.productId);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error deleting product" });
  }
});

export default productRouter;
