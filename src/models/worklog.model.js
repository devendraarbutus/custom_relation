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

    // Array of work timers
    timer: [
      {
        startTime: { type: Date, required: true },
        endTime: { type: Date, default: null },   // safer default
        notes: { type: String, trim: true, default: "" }
      }
    ],

    // Array of breaks
    breaks: [
      {
        startTime: { type: Date, required: true },
        endTime: { type: Date, default: null },   // safer default
        duration: { type: Number, default: 0 }    // stored in ms
      }
    ],

    // Tracks when timer was last stopped for auto break calculation
    lastStopTime: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Compound indexes
WorkLogSchema.index({ employeeId: 1, taskId: 1 });
WorkLogSchema.index({ employeeId: 1, updatedAt: -1 });

export default mongoose.model("WorkLog", WorkLogSchema);
