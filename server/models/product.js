import mongoose from "mongoose";
import UserModel from "./user.js";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
  inStock: { type: Boolean, required: true, default: true },
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
