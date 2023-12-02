import express from "express";
import UserModel from "../models/user.js";
import ProductModel from "../models/product.js";
import middleware from "../middleware/index.js";

const productRouter = express.Router();

productRouter.get("/create-random", async (req, res) => {
  const randomSupplier = await UserModel.findOne({ role: "supplier" });
  if (!randomSupplier) {
    return res
      .status(404)
      .json({ status: "error", message: "Supplier not found" });
  }

  try {
    const product = new ProductModel({
      name: "Product " + Math.floor(Math.random() * 100),
      rating: Math.floor(Math.random() * 5),
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

// // Endpoint to add a new product
// productRouter.post("/add-product", async (req, res) => {
//   try {
//     const newProduct = new ProductModel({
//       name: req.body.name,
//       rating: req.body.rating,
//       price: req.body.price,
//     });

//     const savedProduct = await newProduct.save();
//     res.status(201).json({ status: "success", data: savedProduct });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: "error", message: "Error adding product" });
//   }
// });

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

productRouter.get("/list", middleware, async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json({ status: "success", data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error during search" });
  }
});

export default productRouter;
