import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  joiningYear: {
    type: Date,
    default: Date.now,
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  additionalInfo: mongoose.Schema.Types.Mixed,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
