import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IFitnessGoal {
    goalType: string;
    targetValue: number;
    currentValue: number;
    targetDate: Date;
}

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
    };
    fitnessGoals: IFitnessGoal[];
    createdAt: Date;
    updatedAt: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    setPassword: (password: string) => Promise<void>;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
    },
    fitnessGoals: [{
        goalType: { type: String },
        targetValue: { type: Number },
        currentValue: { type: Number },
        targetDate: { type: Date },
    }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

UserSchema.methods.setPassword = async function (password: string) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.setResetPasswordExpires = function () {
    const expiresInOneHour = Date.now() + 3600000;
    this.resetPasswordExpires = new Date(expiresInOneHour);
};

export default mongoose.model<IUser>('User', UserSchema);
