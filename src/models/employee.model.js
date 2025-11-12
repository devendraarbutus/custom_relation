// src/models/employee.model.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["employee"], default: "employee" }, // employees only
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }, // reference to admin who created
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
