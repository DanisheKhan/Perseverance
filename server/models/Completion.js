import mongoose from "mongoose";

const completionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Habit",
    },
    date: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
completionSchema.index({ userId: 1, habitId: 1, date: 1 });
completionSchema.index({ userId: 1, date: 1 });

const Completion = mongoose.model("Completion", completionSchema);

export default Completion;
