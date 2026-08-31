 import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).strict();

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
}).strict();

// Helper function to generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  }
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// EXPORT 1: Register Controller
export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }
    const { name, email, password } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'Receptionist',
      active: true,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// EXPORT 2: Login Controller
export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }
    const { email, password } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fetch user including password
    const user = await User.findOne({ email: normalizedEmail, active: true }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Direct bcrypt password check
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Generate token using helper
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      data: {
        token,
        user: { id: user._id, email: user.email, role: user.role, name: user.name },
      },
    });
  } catch (error) {
    next(error);
  }
};