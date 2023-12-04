import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  oid: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // new line to reference Product
  supplier_rating: { type: Number, required: true },
  service_rating: { type: Number, required: true },
});

const FeedbackModel = mongoose.model('Feedback', feedbackSchema);
export default FeedbackModel;
