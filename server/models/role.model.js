import mongoose, { Schema } from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uniqure: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  canAdd: [{type: Schema.Types.ObjectId,ref:'Role'}],
  canView: [{type: Schema.Types.ObjectId,ref:'Role'}],
  hasDepartment:{
    type: Boolean,
    required: true,
    default:false
  },
   
});

const Role = mongoose.model('Role', roleSchema);
export default Role;