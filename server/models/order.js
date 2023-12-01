import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  date: {type: Date, required: true,},
  amount: {type: Number, required: true,},
  cid: {type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true,},
  sid: {type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true,},
  mid: {type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true,},
});

const OrderModel = mongoose.model("Order", orderSchema);

// Export the Order model
export default OrderModel;
