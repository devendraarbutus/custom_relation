import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "task", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  breaks: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      type: { type: String, enum: ["lunch", "short", "other"], required: true }
    }
  ],
  totalWorkedTime: { type: Number, default: 0 }, // in hours
  date: { type: Date, required: true },
  status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
  notes: [
    {
      text: { type: String, required: true },
      addedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "notes.addedByModel" },
      addedByModel: { type: String, enum: ["admin", "employee"], required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const WorkLog = mongoose.model("worklog", workLogSchema);
export default WorkLog;
