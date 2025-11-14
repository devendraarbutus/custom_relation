import mongoose from "mongoose";

const { Schema } = mongoose;

const WorkLogSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
      index: true
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true
    },

    timer: [
      {
        startTime: {
          type: Date,
          default: null
        },
        endTime: {
          type: Date,
          default: null
        },
        notes: {
          type: String,
          default: null
        }
      }
    ]
  },
  { timestamps: true }
);

// Index to find active sessions
WorkLogSchema.index({ employeeId: 1, taskId: 1 });

const WorkLog = mongoose.model("WorkLog", WorkLogSchema);
export default WorkLog;
