 import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Fixed secret key to match authController fallback ('supersecretkey')
      const secret = process.env.JWT_SECRET || 'supersecretkey';

      // Verify token
      const decoded = jwt.verify(token, secret);

      // Support decoded.id or decoded._id
      const userId = decoded.id || decoded._id;

      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        console.error('❌ Auth Failed: User ID not found in MongoDB:', userId);
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      return next();
    } catch (error) {
      // Look at your Node terminal to see the exact JWT error message
      console.error('❌ JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: error.message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};