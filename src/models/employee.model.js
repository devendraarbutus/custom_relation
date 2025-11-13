import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee"], default: "employee" }, 
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, 
  },
  { timestamps: true }
);
const Employee= mongoose.model("employee", employeeSchema);

export default Employee;