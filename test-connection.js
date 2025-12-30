require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function testConnection() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connection successful');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

testConnection();
