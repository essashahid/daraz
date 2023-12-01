import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  oid: {type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true,},
  supplier_rating: {type: Number,required: true,},
  service_rating: {type: Number,required: true,},
});

const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

// Export the Feedback model
export default FeedbackModel;
