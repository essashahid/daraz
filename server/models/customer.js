import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {type: String, required: true,},
  email: {type: String, required: true,},
  password: {type: String, required: true,},
});

const CustomerModel = mongoose.model('Customer', customerSchema);

export default CustomerModel;
