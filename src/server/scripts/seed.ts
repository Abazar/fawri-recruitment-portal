import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/fawri_recruitment';

async function seedDatabase() {
  try {
    console.info('🌱 Starting database seed...');

    await mongoose.connect(MONGODB_URI);
    console.info('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'super_admin' });

    if (existingAdmin) {
      console.info('ℹ️ Admin already exists. Skipping seed.');
      process.exit(0);
    }

    await User.create([
      {
        email: 'admin@fawri.com',
        passwordHash: 'Admin@123',
        role: 'super_admin',
        profile: {
          firstName: 'Super',
          lastName: 'Admin',
          phone: '+1234567890',
        },
        isActive: true,
        isEmailVerified: true,
        language: 'en',
      },
      {
        email: 'hr@fawri.com',
        passwordHash: 'Hr@123456',
        role: 'hr_admin',
        profile: {
          firstName: 'HR',
          lastName: 'Manager',
          phone: '+1234567891',
        },
        isActive: true,
        isEmailVerified: true,
        language: 'en',
      },
    ]);

    console.info('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();
