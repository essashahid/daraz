import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure the email is unique
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['customer', 'supplier', 'manager'] }, // Add role field
});

const CustomerModel = mongoose.model('Customer', customerSchema);

export default CustomerModel;
