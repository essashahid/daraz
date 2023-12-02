import mongoose from "mongoose";
import UserModel from "./user.js";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  price: { type: Number, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
