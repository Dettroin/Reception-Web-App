 import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedUser = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing. Check backend/.env.');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const email = 'aryanbhardwaj0024@gmail.com';
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findOneAndUpdate(
      { email },
      {
        name: 'Aryan Bhardwaj',
        email,
        passwordHash,
        role: 'admin',
        active: true
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    console.log('User created/updated successfully.');
    console.log('Email:', user.email);
    console.log('Password: password123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedUser();