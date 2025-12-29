import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

const DEV_JWT_SECRET = 'demo-jwt-secret-please-change-in-production-12345';
const DEV_JWT_REFRESH_SECRET = 'demo-refresh-secret-please-change-in-production-67890';

const JWT_SECRET = (() => {
  const fromEnv = process.env.JWT_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return DEV_JWT_SECRET;
})();

const JWT_REFRESH_SECRET = (() => {
  const fromEnv = process.env.JWT_REFRESH_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_REFRESH_SECRET is required in production');
  }
  return DEV_JWT_REFRESH_SECRET;
})();

// Access token expires in 15 minutes
const ACCESS_TOKEN_EXPIRY = '15m';
// Refresh token expires in 7 days
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const generateTokenPair = (userId: Types.ObjectId | string, email: string, role: string) => {
  const payload: JWTPayload = {
    userId: userId.toString(),
    email,
    role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
