const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { User, getIsFallback } = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required (min 3 chars)')
      .trim()
      .isLength({ min: 3 }),
    check('email', 'Please include a valid email address')
      .isEmail()
      .normalizeEmail(),
    check('password', 'Password must be at least 6 characters long')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Map validation errors to an array of messages
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if email already registered
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'Email is already registered', path: 'email' }]
        });
      }

      // Check if username already exists
      user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'Username is already taken', path: 'username' }]
        });
      }

      // Create user instance
      user = new (User)({
        username,
        email,
        password
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user
      await user.save();

      // Generate JWT Token
      const payload = {
        user: {
          id: user._id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'super_secret_auth_key_123_designed_by_antigravity',
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token, isFallback: getIsFallback() });
        }
      );
    } catch (err) {
      console.error('Registration Error:', err.message);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get session token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid Email or Password', path: 'email' }]
        });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid Email or Password', path: 'password' }]
        });
      }

      // Generate JWT Token
      const payload = {
        user: {
          id: user._id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'super_secret_auth_key_123_designed_by_antigravity',
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, isFallback: getIsFallback() });
        }
      );
    } catch (err) {
      console.error('Login Error:', err.message);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route   GET api/auth/me
// @desc    Fetch authenticated user details
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User session invalid' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      isFallback: getIsFallback()
    });
  } catch (err) {
    console.error('Fetch Auth User Error:', err.message);
    res.status(500).json({ message: 'Server error retrieving credentials' });
  }
});

module.exports = router;
