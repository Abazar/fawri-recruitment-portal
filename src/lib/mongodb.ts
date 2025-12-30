import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = (process.env.DATABASE_URL || process.env.MONGODB_URI) as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseGlobal {
  mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

declare const global: typeof globalThis & MongooseGlobal;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    // Prefer IPv4 for DNS resolution (Node >= 17)
    try {
      // @ts-ignore
      const dns = await import('node:dns');
      if (typeof dns.setDefaultResultOrder === 'function') {
        dns.setDefaultResultOrder('ipv4first');
      }
    } catch {
      // Ignore if not supported
    }

    cached.promise = (async () => {
      const maxAttempts = 5;
      let attempt = 0;
      let lastError: any = null;
      while (attempt < maxAttempts) {
        attempt++;
        console.log(`MongoDB connection attempt ${attempt}...`);
        try {
          const mongooseInstance = await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            family: 4,
          });
          console.log('✅ MongoDB connected successfully');
          return mongooseInstance.connection;
        } catch (err) {
          lastError = err;
          console.error(`❌ MongoDB connection failed (attempt ${attempt}):`, err);
          if (attempt < maxAttempts) {
            await new Promise((res) => setTimeout(res, 5000));
          }
        }
      }
      cached.promise = null;
      throw lastError;
    })();
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
  return cached.conn;
}
