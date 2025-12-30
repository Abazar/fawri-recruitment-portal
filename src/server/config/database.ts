import dns from 'node:dns';
import mongoose from 'mongoose';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let lastDatabaseErrorMessage: string | null = null;
let lastDatabaseErrorAt: string | null = null;

const toSafeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

export const getDatabaseLastError = () => ({
  message: lastDatabaseErrorMessage,
  at: lastDatabaseErrorAt,
});

// MongoDB Atlas connections can intermittently fail on some Windows networks when IPv6 is preferred.
// Prefer IPv4 results to improve handshake reliability without changing connection strings.
try {
  // Node >= 17.0
  // Use type assertion for dns module compatibility
  const setDefaultResultOrder = (dns as unknown as { setDefaultResultOrder?: (order: string) => void }).setDefaultResultOrder;
  setDefaultResultOrder?.('ipv4first');
} catch {
  // Ignore; not supported on older Node versions.
}

export const isDatabaseConnected = (): boolean => mongoose.connection.readyState === 1;

export const connectDatabase = async (): Promise<void> => {
  const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/fawri_recruitment';

  // Handle connection events (register once)
  if (mongoose.connection.listenerCount('error') === 0) {
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
  }

  if (mongoose.connection.listenerCount('disconnected') === 0) {
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
  }

  // Graceful shutdown (register once)
  if (process.listenerCount('SIGINT') === 0) {
    process.on('SIGINT', async () => {
      await mongoose.connection.close().catch(() => undefined);
      console.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  }

  // If already connected, no-op
  if (isDatabaseConnected()) {
    return;
  }

  // Keep retrying so the API can come up even if Atlas is still activating IP rules.
  // This avoids the frontend showing a network error when the DB is temporarily unavailable.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await mongoose.connect(databaseUrl, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
      });
      console.info('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      lastDatabaseErrorMessage = toSafeErrorMessage(error);
      lastDatabaseErrorAt = new Date().toISOString();
      console.error('❌ Failed to connect to MongoDB (will retry):', error);
      await sleep(5000);
    }
  }
};
