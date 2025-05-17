import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;