require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const promClient = require('prom-client');
const register = promClient.register;
promClient.collectDefaultMetrics({ register });

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send("Database Service is running");
});

// Routes
app.use('/api/artworks', require('./routes/artworks'));
app.use('/api/analyses', require('./routes/analyses'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Database Service is running on port ${PORT}`);
}); 