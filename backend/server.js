const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://orbitask-roan.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allow any Vercel preview deployment for your project
    const isVercelPreview = /^https:\/\/orbitask-.*\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      console.error('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 Orbitask API is running!', status: 'healthy' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });