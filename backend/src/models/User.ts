import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Fitness Goal Interface
interface IFitnessGoal {
  goalType: string;
  targetValue: number;
  currentValue: number;
  targetDate: Date;
}

// User Role Enum
enum UserRole {
  Admin = 'admin',
  User = 'user',
}

// User Interface
interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    dob: Date;
  };
  fitnessGoals: IFitnessGoal[];
  role: UserRole; // New field for role
  refreshToken?: string; // Field for storing refresh token
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  setPassword: (password: string) => Promise<void>;
  comparePassword: (password: string) => Promise<boolean>;
  setResetPasswordExpires: () => void;
}

// User Schema
const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  fitnessGoals: [
    {
      goalType: { type: String },
      targetValue: { type: Number },
      currentValue: { type: Number },
      targetDate: { type: Date },
    },
  ],
  role: { type: String, enum: Object.values(UserRole), default: UserRole.User }, // Role field with default as 'user'
  refreshToken: { type: String }, // Field for storing refresh token
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Methods for password handling
UserSchema.methods.setPassword = async function (password: string) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Set the password reset token expiration time
UserSchema.methods.setResetPasswordExpires = function () {
  const expiresInOneHour = Date.now() + 3600000; // Expires in 1 hour
  this.resetPasswordExpires = new Date(expiresInOneHour);
};

// Export the User model
export default mongoose.model<IUser>('User', UserSchema);
