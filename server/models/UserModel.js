import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Store hashed passwords, not plain text
  role: {
    type: String,
    enum: ['customer', 'supplier', 'manager'],
    required: true
  },
  // Add other fields as necessary
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
