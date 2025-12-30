
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/server/models/User';

function maskMongoUri(uri?: string): string {
  if (!uri) return '';
  // Mask password in URI: mongodb+srv://user:password@host/db
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, '$1****$3');
}

export async function GET(): Promise<NextResponse> {
  const MONGODB_URI = process.env.MONGODB_URI;
  const maskedUri = maskMongoUri(MONGODB_URI);
  console.log('Connecting to MongoDB with URI:', maskedUri);

  let userCount = 0;
  let errorInfo: any = null;
  let connected = false;

  try {
    await connectDB();
    connected = true;
    userCount = await User.countDocuments();
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      diagnostics: {
        MONGODB_URI_defined: !!MONGODB_URI,
        maskedUri,
      },
    });
  } catch (error: any) {
    errorInfo = {
      name: error?.name || 'Error',
      message: error?.message || String(error),
      MONGODB_URI_defined: !!MONGODB_URI,
      maskedUri,
    };
    console.error('MongoDB connection error:', errorInfo);
    return NextResponse.json({
      success: false,
      error: errorInfo,
    }, { status: 500 });
  }
}
