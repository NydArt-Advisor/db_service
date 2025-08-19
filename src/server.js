require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const promClient = require('prom-client');
const register = promClient.register;
promClient.collectDefaultMetrics({ register });

// Initialize Express
const app = express();

// Critical environment variables check
const criticalEnvVars = [
    'MONGODB_URI'
];

const missingVars = criticalEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Critical environment variables missing:', missingVars);
    console.error('Please check your .env file and ensure all required variables are set.');
    console.error('See ENVIRONMENT_SETUP.md for setup instructions.');
    process.exit(1);
} else {
    console.log('✅ All critical environment variables are set');
}

// Trust proxy configuration for rate limiting behind load balancers/proxies
app.set('trust proxy', 1);

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            process.env.CLIENT_URL,
            // Add both Vercel domains
            'https://nydartadvisor-p3gw0m3og-darylnyds-projects.vercel.app',
            'https://nydartadvisor.vercel.app',
            'https://nydartadvisor-git-main-darylnyds-projects.vercel.app',
            // Add any other Vercel preview domains
            /^https:\/\/nydartadvisor.*\.vercel\.app$/,
        ];
        
        // Check if origin matches any allowed origins
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            // For development, allow all origins
            if (process.env.NODE_ENV === 'development') {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

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

// Health check endpoint (alternative path)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Database Service',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
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

// Export app for testing
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
        console.log(`Database Service is running on port ${PORT}`);
    });
} 