import express from "express";
import UserModel from "../models/user.js";
import ProductModel from "../models/product.js";
import middleware from "../middleware/index.js";

const productRouter = express.Router();

const adjectives = ["Amazing", "Brilliant", "Creative", "Dynamic", "Elegant", "Fancy", "Glorious"];
const nouns = ["Gadget", "Tool", "Device", "Item", "Product", "Invention", "Mechanism"];

productRouter.get("/create-random", async (req, res) => {
  const randomSupplier = await UserModel.findOne({ role: "supplier" });
  if (!randomSupplier) {
    return res
      .status(404)
      .json({ status: "error", message: "Supplier not found" });
  }

  try {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
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

productRouter.post("/create-custom", async (req, res) => {
  // Assuming the supplier's ID is passed in the request body
  // (or you can extract it from a JWT token if you're using authentication)
  const { supplierId, name, price, rating, customAttributes } = req.body;

  // Validate the supplier's existence
  const supplierExists = await UserModel.exists({ _id: supplierId, role: "supplier" });
  if (!supplierExists) {
    return res.status(404).json({ status: "error", message: "Supplier not found" });
  }

  try {
    // Create a new product with the provided details
    const product = new ProductModel({
      name: name || `Custom Product ${Math.floor(Math.random() * 100)}`,
      rating: rating || Math.floor(Math.random() * 5),
      price: price || Math.floor(Math.random() * 1000),
      supplierId: supplierId,
      inStock: true,
    });

    const savedProduct = await product.save();
    res.status(201).json({ status: "success", data: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error creating custom product" });
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
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
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

// get products by the supplier id
productRouter.get(
  "/supplier-products/:supplierId",
  middleware,
  async (req, res) => {
    try {
      const products = await ProductModel.find({
        supplierId: req.params.supplierId
      });
      res.status(200).json({ status: "success", data: products });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Error retrieving products" });
    }
  }
);


// // Endpoint to add a new product
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

// // Endpoint to update a product
// productRouter.put("/update-product/:productId", async (req, res) => {
//   try {
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       req.params.productId,
//       req.body,
//       { new: true } // Returns the updated document
//     );

//     if (!updatedProduct) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "Product not found" });
//     }

//     res.status(200).json({ status: "success", data: updatedProduct });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ status: "error", message: "Error updating product" });
//   }
// });

// // Endpoint to get a product by ID
// productRouter.get("/get-product/:productId", async (req, res) => {
//   try {
//     const product = await ProductModel.findById(req.params.productId);

//     if (!product) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "Product not found" });
//     }

//     res.status(200).json({ status: "success", data: product });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ status: "error", message: "Error retrieving product" });
//   }
// });

// // Endpoint to delete a product
// productRouter.delete("/delete-product/:productId", async (req, res) => {
//   try {
//     const result = await ProductModel.findByIdAndDelete(req.params.productId);

//     if (!result) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "Product not found" });
//     }

//     res
//       .status(200)
//       .json({ status: "success", message: "Product deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ status: "error", message: "Error deleting product" });
//   }
// });

productRouter.get("/all", async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json({ status: "success", data: { products } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error retrieving products" });
  }
});



export default productRouter;