const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  meetingWith: { type: String, required: true },
  designation: { type: String, required: true },
  vip: { type: Boolean, default: false },
  purpose: { type: String, required: true },
  venue: { type: String, required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
