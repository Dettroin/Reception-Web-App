import mongoose from 'mongoose';
import User from './models/User.js'; // Adjust path as needed

const seedAdminUser = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    const existingUser = await User.findOne({ email: 'admin@reception.com' });
    if (existingUser) {
      console.log('Admin user already exists.');
      process.exit();
    }

    const admin = new User({
      name: 'Reception Admin',
      email: 'admin@reception.com',
      password: 'AdminPassword123', // Automatically hashed by User model pre-save hook
      role: 'Admin',
      active: true,
    });

    await admin.save();
    console.log('Default user created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedAdminUser();