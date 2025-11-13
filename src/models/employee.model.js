// src/models/employee.model.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // for employee login
    mobile: { type: String }, // optional mobile number
    role: { type: String, enum: ["employee"], default: "employee" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
