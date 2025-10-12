import express from "express";
import Completion from "../models/Completion.js";
import Habit from "../models/Habit.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/completions
// @desc    Get all completions for user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { date, habitId } = req.query;
    const filter = { userId: req.user._id };

    if (date) {
      filter.date = date;
    }
    if (habitId) {
      filter.habitId = habitId;
    }

    const completions = await Completion.find(filter).sort({ date: -1 });
    res.json(completions);
  } catch (error) {
    console.error("Get completions error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/completions
// @desc    Create or toggle a completion
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { habitId, date, note } = req.body;

    // Verify habit belongs to user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Check if completion already exists
    const existingCompletion = await Completion.findOne({
      userId: req.user._id,
      habitId,
      date,
    });

    if (existingCompletion) {
      // Toggle completion
      existingCompletion.completed = !existingCompletion.completed;
      existingCompletion.note = note || existingCompletion.note;
      const updated = await existingCompletion.save();
      return res.json(updated);
    }

    // Create new completion
    const completion = await Completion.create({
      userId: req.user._id,
      habitId,
      date,
      completed: true,
      note: note || "",
    });

    res.status(201).json(completion);
  } catch (error) {
    console.error("Create completion error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/completions/:id
// @desc    Update a completion
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const completion = await Completion.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!completion) {
      return res.status(404).json({ message: "Completion not found" });
    }

    Object.keys(req.body).forEach((key) => {
      completion[key] = req.body[key];
    });

    const updatedCompletion = await completion.save();
    res.json(updatedCompletion);
  } catch (error) {
    console.error("Update completion error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/completions/:id
// @desc    Delete a completion
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const completion = await Completion.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!completion) {
      return res.status(404).json({ message: "Completion not found" });
    }

    await completion.deleteOne();
    res.json({ message: "Completion deleted successfully" });
  } catch (error) {
    console.error("Delete completion error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/completions/stats/:habitId
// @desc    Get statistics for a specific habit
// @access  Private
router.get("/stats/:habitId", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const completions = await Completion.find({
      userId: req.user._id,
      habitId: req.params.habitId,
      completed: true,
    }).sort({ date: -1 });

    res.json({
      habitId: req.params.habitId,
      totalCompletions: completions.length,
      completions,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
