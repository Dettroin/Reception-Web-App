 import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper function to generate JWT (Ensures identical secret key and options)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_key', // MUST match auth.js fallback
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// EXPORT 1: Register Controller
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'Receptionist',
      active: true,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// EXPORT 2: Login Controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email, active: true }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token using the helper
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token, // Direct token reference for simpler frontend consumption
      data: {
        token,
        user: { id: user._id, email: user.email, role: user.role, name: user.name },
      },
    });
  } catch (error) {
    next(error);
  }
};