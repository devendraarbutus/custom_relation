import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // keep password
    role: { type: String, enum: ["employee"], default: "employee" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  },
  { timestamps: true }
);

const Employee = mongoose.model("employee", employeeSchema);

export default Employee;
