 import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

// Must be POST methods
router.post('/login', login);
router.post('/register', register); // Change to '/signup' if your frontend calls /api/auth/signup

export default router;