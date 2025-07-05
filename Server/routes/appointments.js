const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const authenticateToken = require("../middleware/authMiddleware");

/**
 * @route   POST /api/appointments/add
 * @desc    Add a new appointment (Protected)
 */
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: "Appointment added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add appointment", error });
  }
});

/**
 * @route   GET /api/appointments/upcoming
 * @desc    Get all upcoming appointments (today & future)
 */
router.get("/upcoming", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const appointments = await Appointment.find({ date: { $gte: today } }).sort(
      { date: 1 }
    );
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch upcoming appointments", error });
  }
});

/**
 * @route   GET /api/appointments/past?from=YYYY-MM-DD&to=YYYY-MM-DD
 * @desc    Get past appointments between two dates
 */
router.get("/past", async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res
      .status(400)
      .json({ message: "Please provide both from and to dates" });
  }

  try {
    const appointments = await Appointment.find({
      date: { $gte: from, $lte: to },
    }).sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch past appointments", error });
  }
});

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update an appointment by ID (Protected)
 */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment", error });
  }
});

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Delete an appointment by ID (Protected)
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete appointment", error });
  }
});

module.exports = router;
