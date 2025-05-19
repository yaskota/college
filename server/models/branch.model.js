import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  code: {
    type:String,
    require:true
  },
  name:{
    type:String,
    require:true
  } ,
  description: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hod: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Department", departmentSchema);
