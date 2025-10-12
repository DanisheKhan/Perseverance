import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Personal",
    },
    color: {
      type: String,
      default: "#6366F1",
    },
    frequency: {
      type: String,
      default: "daily",
      enum: ["daily", "weekly", "custom"],
    },
    target: {
      type: Number,
      default: 7,
    },
    icon: {
      type: String,
      default: "🎯",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
habitSchema.index({ userId: 1, isActive: 1 });

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
