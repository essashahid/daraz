import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
    name: {type: String, required: true,},
    email: {type: String, required: true,},
    password: {type: String, required: true,},
});

const ManagerModel = mongoose.model('Manager', managerSchema);

export default ManagerModel;
