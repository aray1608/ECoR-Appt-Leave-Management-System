const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const authenticateToken = require("../middleware/authMiddleware"); // ✅ Fixed path

// POST a new leave (admin only)
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const newLeave = new Leave(req.body);
    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create leave", error: err.message });
  }
});

// GET all leaves (public)
router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ from: 1 });
    res.json(leaves);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch leaves", error: err.message });
  }
});

// GET upcoming leaves (public)
router.get("/upcoming", async (req, res) => {
  try {
    const today = new Date();
    const leaves = await Leave.find({ from: { $gte: today } }).sort({
      from: 1,
    });
    res.json(leaves);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch upcoming leaves", error: err.message });
  }
});

// GET past leaves by date range (public)
router.get("/past", async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "From and To dates are required" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const leaves = await Leave.find({
      from: { $gte: fromDate },
      to: { $lte: toDate },
    }).sort({ from: 1 });

    res.json(leaves);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch past leaves", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.json(leave);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch leave", error: err.message });
  }
});
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedLeave);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update leave", error: err.message });
  }
});

// DELETE a leave by ID (admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to delete leave", error: err.message });
  }
});

module.exports = router;
