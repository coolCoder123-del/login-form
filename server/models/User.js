const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Real Mongoose Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RealUserModel = mongoose.model('User', UserSchema);

// File-based Mock Database Emulation
const mockDbPath = path.join(__dirname, '../mock-db.json');

const readMockDb = () => {
  try {
    if (!fs.existsSync(mockDbPath)) {
      fs.writeFileSync(mockDbPath, JSON.stringify([], null, 2));
      return [];
    }
    return JSON.parse(fs.readFileSync(mockDbPath, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeMockDb = (data) => {
  fs.writeFileSync(mockDbPath, JSON.stringify(data, null, 2));
};

// Emulated Mongoose Model to maintain code compatibility in routes
class MockUserModel {
  constructor(data) {
    this._id = data._id || Math.random().toString(36).substring(2, 11);
    this.username = data.username;
    this.email = (data.email || '').toLowerCase();
    this.password = data.password;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  async save() {
    const users = readMockDb();
    
    // Check constraints manually to mimic database error responses (e.g. duplicate key code 11000)
    const emailExists = users.some(u => u.email === this.email && u._id !== this._id);
    const usernameExists = users.some(u => u.username === this.username && u._id !== this._id);
    
    if (emailExists) {
      const err = new Error('Email already exists');
      err.code = 11000;
      err.keyValue = { email: this.email };
      throw err;
    }
    if (usernameExists) {
      const err = new Error('Username already exists');
      err.code = 11000;
      err.keyValue = { username: this.username };
      throw err;
    }

    const index = users.findIndex(u => u._id === this._id);
    if (index >= 0) {
      users[index] = {
        _id: this._id,
        username: this.username,
        email: this.email,
        password: this.password,
        createdAt: this.createdAt.toISOString()
      };
    } else {
      users.push({
        _id: this._id,
        username: this.username,
        email: this.email,
        password: this.password,
        createdAt: this.createdAt.toISOString()
      });
    }
    writeMockDb(users);
    return this;
  }

  static async findOne(query) {
    const users = readMockDb();
    let found = null;
    
    if (query.email) {
      const qEmail = query.email.toLowerCase();
      found = users.find(u => u.email === qEmail);
    } else if (query.username) {
      found = users.find(u => u.username === query.username);
    } else if (query._id) {
      found = users.find(u => u._id === query._id);
    }
    
    return found ? new MockUserModel(found) : null;
  }

  static async findById(id) {
    const users = readMockDb();
    const found = users.find(u => u._id === id);
    return found ? new MockUserModel(found) : null;
  }
}

// Helper to determine active DB mode
const getIsFallback = () => process.env.USE_MOCK_DB === 'true';

module.exports = {
  // Export a dynamic getter so changes in process.env.USE_MOCK_DB are hot-swapped
  get User() {
    return getIsFallback() ? MockUserModel : RealUserModel;
  },
  getIsFallback
};
