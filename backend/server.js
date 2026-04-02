require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express App
const app = express();

// Connect to MongoDB Atlas
connectDB();

// Essential Middleware
app.use(cors());
app.use(express.json()); // Allows the backend to read JSON data from the frontend

// API Routes (Requirement #1 & #2)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));

// Basic Health Check Route
app.get('/', (req, res) => {
    res.send('Zorvyn Finance API is running successfully!');
});

// Global Error Handling Middleware (Requirement #5)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong on the server!',
        error: err.message 
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`ðŸš€ Server running on http://localhost:${PORT}`);
});
