import express from "express";
import Habit from "../models/Habit.js";
import Completion from "../models/Completion.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/habits
// @desc    Get all habits for user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(habits);
  } catch (error) {
    console.error("Get habits error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const habitData = {
      userId: req.user._id,
      ...req.body,
    };

    const habit = await Habit.create(habitData);
    res.status(201).json(habit);
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/habits/:id
// @desc    Get a single habit
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json(habit);
  } catch (error) {
    console.error("Get habit error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    Object.keys(req.body).forEach((key) => {
      habit[key] = req.body[key];
    });

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    console.error("Update habit error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await habit.deleteOne();

    // Also delete all completions for this habit
    await Completion.deleteMany({ habitId: req.params.id });

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Delete habit error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
