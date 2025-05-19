import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  canAdd: {
  type: Array,         // or: type: [Schema.Types.Mixed]
  required: true,
  validate: {
    validator: function(arr) {
      return arr.length >= 1 && arr.length <= 100;
    },
    message: 'canAdd must have between 1 and 100 items.'
  }
}
,
  hasDepartment:{
    type: Boolean,
    required: true,
    default:false
  },
   
});

const Role = mongoose.model('Role', roleSchema);
export default Role;