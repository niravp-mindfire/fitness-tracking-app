import mongoose, { Schema, Document } from 'mongoose';

interface IProgressTracking extends Document {
    userId: mongoose.Types.ObjectId; // reference to User
    date: Date;
    weight: number; // in kg
    bodyFatPercentage?: number;
    muscleMass?: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProgressTrackingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true },
    bodyFatPercentage: { type: Number },
    muscleMass: { type: Number },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProgressTracking>('ProgressTracking', ProgressTrackingSchema);
