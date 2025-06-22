const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Route imports
const authRoutes = require('./routes/auth');          // ✅ For login
const appointmentRoutes = require('./routes/appointments'); // ✅ For appointments

const app = express();

app.use(cors());
app.use(express.json()); // Needed to parse incoming JSON

// Register routes
app.use('/api/auth', authRoutes);            // ✅ POST /api/auth/login
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));
