const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();


// Configure CORS
// Allow common local dev origins plus any FRONTEND_URL value (comma-separated).
const frontendUrl = process.env.FRONTEND_URL; // e.g. "http://localhost:3001" or "https://app.example.com"
const defaultAllowed = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://ride-share-service1.vercel.app'
];

let allowedOrigins = [...defaultAllowed];
if (frontendUrl) {
  const fromEnv = frontendUrl.split(',').map(s => s.trim()).filter(Boolean);
  allowedOrigins = Array.from(new Set([...allowedOrigins, ...fromEnv]));
}

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Ensure preflight requests are handled for all routes
app.options('*', cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rideshare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));

app.get('/', (req, res) => {
  res.send('Ride Share API Running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
