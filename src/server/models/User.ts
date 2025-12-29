import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole =
  | 'applicant'
  | 'super_admin'
  | 'hr_admin'
  | 'finance_officer'
  | 'training_manager'
  | 'support';

export type Language = 'en' | 'ur' | 'hi' | 'ne';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: Date;
    nationality?: string;
    currentCountry?: string;
    currentCity?: string;
    avatar?: string;
  };
  language: Language;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockoutUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        'applicant',
        'super_admin',
        'hr_admin',
        'finance_officer',
        'training_manager',
        'support',
      ],
    },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      dateOfBirth: Date,
      nationality: String,
      currentCountry: String,
      currentCity: String,
      avatar: String,
    },
    language: {
      type: String,
      enum: ['en', 'ur', 'hi', 'ne'],
      default: 'en',
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockoutUntil: Date,
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    deletedAt: Date,
  },
  { timestamps: true }
);

// Password hash
UserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

// Methods
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;
  await this.save();
};

UserSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockoutUntil = undefined;
  await this.save();
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
