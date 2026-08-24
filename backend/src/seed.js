 import mongoose from 'mongoose';
import User from './models/User.js'; // Adjust path as needed

const seedAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reception_db');

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