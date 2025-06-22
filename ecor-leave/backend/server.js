require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Route imports
const authRoutes = require('./routes/auth');     // For login
const leaveRoutes = require('./routes/leaves');  // Leave-related routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON

// Routes
app.use('/api/auth', authRoutes);      // POST /api/auth/login
app.use('/api/leaves', leaveRoutes);   // GET, POST, PUT for leaves

app.get('/', (req, res) => res.send('API is working'));

// Env Config
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// DB Connection & Server Start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));
