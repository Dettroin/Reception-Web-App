import mongoose from 'mongoose';

let isConnected = false;

export const connectDb = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is missing.');
    return;
  }

  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB connection error:', error.message);
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB event error:', err.message);
});