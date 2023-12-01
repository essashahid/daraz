import mongoose from 'mongoose';

const orderDetailsSchema = new mongoose.Schema({
  pid: {type: mongoose.Schema.Types.ObjectId, ref: 'Product',required: true,},
  oid: {type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true,},
});

const OrderDetailsModel = mongoose.model('OrderDetails', orderDetailsSchema);

export default OrderDetailsModel;
