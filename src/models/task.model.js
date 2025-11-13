// src/models/task.model.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "overdue"],
      default: "pending"
    },
    dueDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model("Task", taskSchema);
