require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Establish DB connection (MongoDB with mock fallback)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/auth'));

// Base healthcheck route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'MERN Auth API Server is running',
    dbFallback: process.env.USE_MOCK_DB === 'true'
  });
});

// Define server PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`  SERVER ONLINE: http://localhost:${PORT}`);
  console.log(`  Database Mode: ${process.env.USE_MOCK_DB === 'true' ? 'JSON Mock Fallback' : 'MongoDB Connection'}`);
  console.log(`=============================================`);
});
