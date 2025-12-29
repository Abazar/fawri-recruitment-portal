import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';
import Application from '../models/Application';
import { generateTokenPair } from '../utils/jwt';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  dateOfBirth: z.string().optional(),
  nationality: z.string().min(2, 'Nationality is required'),
  currentCountry: z.string().min(2, 'Current country is required'),
  language: z.enum(['en', 'ur', 'hi', 'ne']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(request.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });

    if (existingUser) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Create new user (applicant role by default)
    const user = new User({
      email: validatedData.email.toLowerCase(),
      passwordHash: validatedData.password, // Will be hashed by pre-save hook
      role: 'applicant',
      profile: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
        nationality: validatedData.nationality,
        currentCountry: validatedData.currentCountry,
      },
      language: validatedData.language || 'en',
    });

    await user.save();

    // Create draft application for the new applicant
    const application = new Application({
      userId: user._id,
      applicantName: `${user.profile.firstName} ${user.profile.lastName}`,
      applicantEmail: user.email,
      applicantPhone: user.profile.phone,
      status: 'draft',
      source: {
        channel: 'website',
      },
      statusHistory: [
        {
          status: 'draft',
          changedBy: user._id,
          changedAt: new Date(),
          notes: 'Application created on registration',
        },
      ],
    });

    await application.save();

    // Generate tokens
    const tokens = generateTokenPair(user._id, user.email, user.role);

    return reply.status(201).send({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          language: user.language,
        },
        tokens,
      },
      message: 'Registration successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.issues,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Handle duplicate key errors (e.g., same email registered concurrently)
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === 11000) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists',
        },
        timestamp: new Date().toISOString(),
      });
    }

    console.error('Registration error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during registration',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(request.body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email.toLowerCase() });

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000);
      return reply.status(423).send({
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: `Account locked due to too many failed login attempts. Try again in ${minutesRemaining} minutes.`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check if account is active
    if (!user.isActive || user.deletedAt) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(validatedData.password);

    if (!isPasswordValid) {
      await user.incrementLoginAttempts();

      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(user._id, user.email, user.role);

    return reply.status(200).send({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          language: user.language,
        },
        tokens,
      },
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.issues,
        },
        timestamp: new Date().toISOString(),
      });
    }

    console.error('Login error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during login',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await User.findById(request.user?.userId);

    if (!user) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    return reply.status(200).send({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          phone: user.profile.phone,
          language: user.language,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get user error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching user data',
      },
      timestamp: new Date().toISOString(),
    });
  }
};
