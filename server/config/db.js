const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  try {
    // Set mongoose connection options
    mongoose.set('strictQuery', false);
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-login';
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 // Timeout after 2 seconds instead of waiting forever
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = 'false';
  } catch (err) {
    console.log('\n=============================================');
    console.log('   WARNING: LOCAL DATABASE FALLBACK ENABLED  ');
    console.log('=============================================');
    console.log(`Could not connect to MongoDB: ${err.message}`);
    console.log('Using a local file-based database for development.');
    console.log(`User data will be stored at: ${path.resolve(__dirname, '../mock-db.json')}`);
    console.log('=============================================\n');
    
    process.env.USE_MOCK_DB = 'true';
    
    // Initialize mock db file if not present
    const dbPath = path.join(__dirname, '../mock-db.json');
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
    }
  }
};

module.exports = connectDB;
