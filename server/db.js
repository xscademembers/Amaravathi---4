import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
try { dns.setDefaultResultOrder?.('ipv4first'); } catch { /* older Node */ }

let connected = false;

export const isDbConnected = () => connected;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not set — gallery will use static fallback only');
    return;
  }

  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
      });
      connected = true;
      mongoose.connection.on('disconnected', () => {
        connected = false;
      });
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB attempt ${attempt}/${maxAttempts} failed:`, error.message);
      if (attempt < maxAttempts) await sleep(2000 * attempt);
    }
  }

  console.warn('MongoDB unavailable — API will serve static gallery fallback until connection succeeds');
};

export default connectDB;
