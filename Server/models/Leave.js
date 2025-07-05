const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  officer: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s]+$/, 'Officer name must contain only letters and spaces']
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  outTo: {
    type: String, // it's a location
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Leave', 'Duty'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
