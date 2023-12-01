import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {type: String, required: true,},
  email: {type: String, required: true,},
  password: {type: String, required: true,},
});

const SupplierModel = mongoose.model('Supplier', supplierSchema);

export default SupplierModel;
