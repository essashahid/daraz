import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {type: String,required: true,},
  rating: {type: Number, required: true,},
  price: {type: Number,required: true,},
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
